import { z } from "zod";

/** Rules for the public dumping report on the website. Kept free of React so tests can exercise them. */

export const REPORT_TYPES = ["Illegal dump", "Overflowing public bin", "Blocked drain", "Market waste"] as const;
export const REPORT_SIZES = [
  { value: "Small", hint: "A few bags" },
  { value: "Medium", hint: "A tricycle load" },
  { value: "Large", hint: "A truckload or more" },
] as const;

export const LAGOS_LGAS = [
  "Agege",
  "Ajeromi-Ifelodun",
  "Alimosho",
  "Amuwo-Odofin",
  "Apapa",
  "Badagry",
  "Epe",
  "Eti-Osa",
  "Ibeju-Lekki",
  "Ifako-Ijaiye",
  "Ikeja",
  "Ikorodu",
  "Kosofe",
  "Lagos Island",
  "Lagos Mainland",
  "Mushin",
  "Ojo",
  "Oshodi-Isolo",
  "Shomolu",
  "Surulere",
] as const;

export const MAX_PHOTOS = 3;
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
/** Must match SITE_REPORTS_KEY in lawma/work/hub.js so the workspace inbox picks reports up. */
export const SITE_REPORTS_KEY = "lawma.site.reports.v1";

/** Rough bounding box of Lagos State; a pin outside it is almost certainly wrong. */
export const LAGOS_BOUNDS = { south: 6.35, north: 6.75, west: 2.7, east: 4.4 };
export const inLagos = (lat: number, lng: number) =>
  lat >= LAGOS_BOUNDS.south && lat <= LAGOS_BOUNDS.north && lng >= LAGOS_BOUNDS.west && lng <= LAGOS_BOUNDS.east;

const PHONE = /^(\+234|234|0)[789][01]\d{8}$/;
export const normalisePhone = (raw: string) => raw.replace(/[\s()-]/g, "");
export const isNigerianMobile = (raw: string) => PHONE.test(normalisePhone(raw));
/** "08031234412" → "0803 ••• 4412": the workspace never shows a reporter's full number. */
export function maskPhone(raw: string) {
  let p = normalisePhone(raw);
  if (p.startsWith("+234")) p = "0" + p.slice(4);
  else if (p.startsWith("234")) p = "0" + p.slice(3);
  return `${p.slice(0, 4)} ••• ${p.slice(-4)}`;
}

export const photoSchema = z.object({
  name: z.string(),
  type: z.string().regex(/^image\//, "Choose a photo (JPG, PNG or HEIC)."),
  size: z.number().max(MAX_PHOTO_BYTES, "Each photo must be under 15 MB."),
});

export const photosSchema = z
  .array(photoSchema)
  .min(1, "Add at least one photo of the waste.")
  .max(MAX_PHOTOS, `Add up to ${MAX_PHOTOS} photos.`);

export const locationSchema = z
  .object({
    lga: z.string(),
    landmark: z.string().trim().max(160, "Keep the street or landmark under 160 characters."),
    pin: z.object({ lat: z.number(), lng: z.number() }).nullable(),
  })
  .superRefine((v, ctx) => {
    if (!(LAGOS_LGAS as readonly string[]).includes(v.lga))
      ctx.addIssue({ code: "custom", path: ["lga"], message: "Choose the local government area." });
    if (v.pin && !inLagos(v.pin.lat, v.pin.lng))
      ctx.addIssue({ code: "custom", path: ["pin"], message: "That pin is outside Lagos. Type the street instead." });
    if (!v.pin && v.landmark.length < 4)
      ctx.addIssue({ code: "custom", path: ["landmark"], message: "Give the street or a landmark so the crew can find it." });
  });

export const detailsSchema = z
  .object({
    type: z.enum(REPORT_TYPES),
    size: z.enum(["Small", "Medium", "Large"]),
    description: z
      .string()
      .trim()
      .min(10, "Tell us a little more (at least 10 characters).")
      .max(500, "Keep the description under 500 characters."),
    name: z.string().trim().max(80, "Keep your name under 80 characters."),
    phone: z.string().trim().max(20),
    updates: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.phone && !isNigerianMobile(v.phone))
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Enter a Nigerian mobile number, e.g. 0803 123 4567." });
    if (v.updates && !v.phone)
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Add a phone number to receive updates." });
  });

export type ReportLocation = z.infer<typeof locationSchema>;
export type ReportDetails = z.infer<typeof detailsSchema>;

/** Letters and digits that cannot be misread over the phone (no 0/O, 1/I/L). */
const REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const REFERENCE_PATTERN = /^LAW-\d{6}-[2-9A-HJKMNP-Z]{4}$/;

/** Reference read back to the reporter: LAW-YYMMDD-XXXX, unique among `taken`. */
export function makeReference(now: Date, taken: Iterable<string> = [], rand: () => number = Math.random) {
  const used = new Set(taken);
  const d = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  for (;;) {
    let tail = "";
    for (let i = 0; i < 4; i++) tail += REF_ALPHABET[Math.floor(rand() * REF_ALPHABET.length)];
    const ref = `LAW-${d}-${tail}`;
    if (!used.has(ref)) return ref;
  }
}

export type StoredReport = {
  ref: string;
  raised: string;
  type: ReportDetails["type"];
  size: ReportDetails["size"];
  area: string;
  place: string;
  description: string;
  coord: [number, number] | null;
  reporter: string;
  photo: string | null;
};

/** Shape handed to the workspace inbox. Coordinates are [lng, lat] like the workspace map. */
export function toStoredReport(
  ref: string,
  raised: Date,
  loc: ReportLocation,
  details: ReportDetails,
  photo: string | null,
): StoredReport {
  const who = details.name.trim() || "Resident";
  return {
    ref,
    raised: raised.toISOString(),
    type: details.type,
    size: details.size,
    area: loc.lga,
    place: loc.landmark.trim() || (loc.pin ? `Pinned at ${loc.pin.lat.toFixed(5)}, ${loc.pin.lng.toFixed(5)}` : loc.lga),
    description: details.description.trim(),
    coord: loc.pin ? [loc.pin.lng, loc.pin.lat] : null,
    reporter: details.phone ? `${who} · ${maskPhone(details.phone)}` : `${who} · no phone given`,
    photo,
  };
}
