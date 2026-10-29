import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";

import {
  LAGOS_LGAS,
  MAX_PHOTOS,
  REPORT_SIZES,
  REPORT_TYPES,
  SITE_REPORTS_KEY,
  detailsSchema,
  inLagos,
  locationSchema,
  makeReference,
  maskPhone,
  photosSchema,
  toStoredReport,
  type ReportDetails,
  type StoredReport,
} from "@/lib/site/report";
import { cn } from "@/lib/utils";

type Photo = { id: string; name: string; type: string; size: number; url: string };
type Location = { lga: string; landmark: string; pin: { lat: number; lng: number } | null };
type ErrKey = "_" | "photos" | "pin" | "lga" | "landmark" | "type" | "size" | "description" | "name" | "phone" | "updates";
type Errors = Partial<Record<ErrKey, string>>;

const STEPS = ["Photo", "Location", "Details", "Check and send"] as const;
const QUESTIONS = ["Add a photo of the waste", "Where is it?", "Tell us about it", "Check your report"] as const;

const field =
  "w-full rounded-lg border border-ink/20 bg-card px-3.5 text-[1rem] text-ink outline-none transition-colors placeholder:text-stone/60 focus:border-ink focus:ring-2 focus:ring-ember/30 aria-[invalid=true]:border-destructive";

const primary =
  "inline-flex h-11 items-center rounded-lg bg-ember px-5 text-[0.9375rem] font-semibold text-ember-foreground transition-colors hover:bg-ember-deep disabled:opacity-60";
const secondary =
  "inline-flex h-11 items-center rounded-lg border border-ink/20 bg-card px-4 text-[0.9375rem] font-medium text-ink transition-colors hover:border-ink/50 disabled:opacity-60";
const textLink = "font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink";

/** Downscale a photo in the browser so it stays light enough to keep and show in the workspace. */
function shrink(file: File, max = 960): Promise<string> {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(src);
      resolve(c.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("unreadable"));
    };
    img.src = src;
  });
}

function readStored(): StoredReport[] {
  try {
    const v = JSON.parse(localStorage.getItem(SITE_REPORTS_KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function store(report: StoredReport) {
  const list = [report, ...readStored()].slice(0, 10);
  try {
    localStorage.setItem(SITE_REPORTS_KEY, JSON.stringify(list));
  } catch {
    // Storage full: keep the new report, drop older photos.
    localStorage.setItem(SITE_REPORTS_KEY, JSON.stringify(list.map((r, i) => (i ? { ...r, photo: null } : r))));
  }
}

function issues(result: { success: boolean; error?: { issues: { path: (string | number)[]; message: string }[] } }) {
  const out: Record<string, string> = {};
  if (!result.success) for (const i of result.error?.issues ?? []) out[String(i.path[0] ?? "_")] ??= i.message;
  return out as Errors;
}

function Label({ htmlFor, children, optional, hint }: { htmlFor?: string; children: ReactNode; optional?: boolean; hint?: string }) {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="block text-[0.9375rem] font-semibold text-ink">
        {children}
        {optional && <span className="font-normal text-stone"> (optional)</span>}
      </label>
      {hint && <p className="mt-0.5 text-[0.875rem] text-stone">{hint}</p>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children?: string | undefined }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-[0.875rem] font-medium text-destructive">
      {children}
    </p>
  );
}

function Choice({
  name,
  checked,
  onChange,
  children,
  hint,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
        checked ? "border-ink/60 bg-card" : "border-line-light bg-card hover:border-ink/30",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="size-[18px] shrink-0 cursor-pointer accent-[var(--ink)]" />
      <span className="text-[0.9375rem]">
        <span className="font-medium text-ink">{children}</span>
        {hint && <span className="text-stone"> · {hint}</span>}
      </span>
    </label>
  );
}

export function ReportFlow() {
  const uid = useId();
  const top = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [reading, setReading] = useState(false);
  const [loc, setLoc] = useState<Location>({ lga: "", landmark: "", pin: null });
  const [locating, setLocating] = useState(false);
  const [details, setDetails] = useState<ReportDetails>({
    type: "Illegal dump",
    size: "Medium",
    description: "",
    name: "",
    phone: "",
    updates: false,
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ report: StoredReport; updates: string | null } | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    const y = top.current?.getBoundingClientRect().top ?? 0;
    if (y < 0) window.scrollTo({ top: window.scrollY + y - 110, behavior: "smooth" });
  }, [step, done]);

  const clear = (k: ErrKey) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));

  const go = (n: number) => {
    setErrors({});
    setStep(n);
  };

  const validate = (n: number): Errors => {
    if (n === 0) return issues(photosSchema.safeParse(photos));
    if (n === 1) return issues(locationSchema.safeParse(loc));
    if (n === 2) return issues(detailsSchema.safeParse(details));
    return {};
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length === 0) go(step + 1);
  };

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    const room = MAX_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, room);
    const check = photosSchema.safeParse([...photos, ...picked.map((f) => ({ name: f.name, type: f.type, size: f.size }))]);
    if (!check.success) {
      setErrors(issues(check));
      return;
    }
    setReading(true);
    setErrors({});
    const added: Photo[] = [];
    for (const f of picked) {
      try {
        added.push({ id: crypto.randomUUID(), name: f.name, type: f.type, size: f.size, url: await shrink(f) });
      } catch {
        setErrors({ _: "We could not open that photo. Try a JPG or PNG." });
      }
    }
    setPhotos((p) => [...p, ...added]);
    setReading(false);
    if (files.length > room) setErrors({ _: `You can add up to ${MAX_PHOTOS} photos.` });
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      setErrors({ pin: "This browser cannot share your location. Enter the street instead." });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocating(false);
        const pin = { lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6) };
        setLoc((l) => ({ ...l, pin }));
        setErrors(inLagos(pin.lat, pin.lng) ? {} : { pin: "That location is outside Lagos. Enter the street instead." });
      },
      () => {
        setLocating(false);
        setErrors({ pin: "We could not get your location. Allow location access, or enter the street instead." });
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  async function send() {
    const parsedLoc = locationSchema.safeParse(loc);
    const parsedDetails = detailsSchema.safeParse(details);
    if (!parsedLoc.success || !parsedDetails.success || photos.length === 0) {
      go(photos.length === 0 ? 0 : !parsedLoc.success ? 1 : 2);
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    const now = new Date();
    const ref = makeReference(now, readStored().map((r) => r.ref));
    const report = toStoredReport(ref, now, parsedLoc.data, parsedDetails.data, photos[0]?.url ?? null);
    store(report);
    setSending(false);
    setDone({ report, updates: parsedDetails.data.updates ? maskPhone(parsedDetails.data.phone) : null });
  }

  function reset() {
    setPhotos([]);
    setLoc({ lga: "", landmark: "", pin: null });
    setDetails({ type: "Illegal dump", size: "Medium", description: "", name: "", phone: "", updates: false });
    setErrors({});
    setStep(0);
    setDone(null);
  }

  if (done) return <Confirmation report={done.report} updates={done.updates} onAnother={reset} headingRef={heading} topRef={top} />;

  const id = (k: string) => `${uid}-${k}`;
  const err = (k: ErrKey) => (errors[k] ? { "aria-invalid": true, "aria-describedby": id(`${k}-err`) } : {});

  return (
    <div ref={top} className="scroll-mt-32">
      <div className="flex items-baseline justify-between gap-4 text-[0.875rem] text-stone">
        <span>
          Step {step + 1} of {STEPS.length}
          <span className="hidden sm:inline"> · {STEPS[step]}</span>
        </span>
        {step > 0 && (
          <button type="button" onClick={() => go(step - 1)} disabled={sending} className={textLink}>
            Back
          </button>
        )}
      </div>
      <div className="mt-3 h-0.5 w-full bg-line-light" aria-hidden="true">
        <div className="h-full bg-ink transition-[width] duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <h2 ref={heading} tabIndex={-1} className="mt-10 text-[1.75rem] font-semibold leading-tight tracking-tight text-ink outline-none md:text-[2rem]">
        {QUESTIONS[step]}
      </h2>

      <div className="mt-6">
        {step === 0 && (
          <div>
            <p className="max-w-[56ch] text-[1rem] leading-relaxed text-stone">
              One clear photo is enough. If you can, include something nearby, like a sign, gate or bus stop, so the crew can find the spot.
            </p>

            {photos.length > 0 && (
              <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photos.map((p, i) => (
                  <li key={p.id}>
                    <img src={p.url} alt={`Photo ${i + 1} of the reported waste`} className="aspect-[4/3] w-full rounded-lg object-cover" />
                    <button type="button" onClick={() => setPhotos((list) => list.filter((x) => x.id !== p.id))} className={cn(textLink, "mt-2 text-[0.875rem]")}>
                      Remove<span className="sr-only"> photo {i + 1}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {photos.length < MAX_PHOTOS && (
              <div className="mt-6">
                <label className={cn(secondary, "cursor-pointer focus-within:ring-2 focus-within:ring-ember/30", reading && "opacity-60")}>
                  {reading ? "Adding photo…" : photos.length ? "Add another photo" : "Choose or take a photo"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    aria-label="Add photos of the waste"
                    {...err("photos")}
                    onChange={(e) => {
                      void addPhotos(e.currentTarget.files);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
                <p className="mt-2 text-[0.875rem] text-stone">JPG or PNG, up to {MAX_PHOTOS} photos.</p>
              </div>
            )}
            <FieldError id={id("photos-err")}>{errors.photos ?? errors._}</FieldError>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-7">
            <div>
              {loc.pin ? (
                <div>
                  <iframe
                    title="Your pinned location"
                    className="h-56 w-full rounded-lg border border-line-light md:h-64"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${loc.pin.lng - 0.004},${loc.pin.lat - 0.0025},${loc.pin.lng + 0.004},${loc.pin.lat + 0.0025}&layer=mapnik&marker=${loc.pin.lat},${loc.pin.lng}`}
                  />
                  <p className="mt-2 text-[0.875rem] text-stone">
                    Location added ({loc.pin.lat.toFixed(5)}, {loc.pin.lng.toFixed(5)}).{" "}
                    <button type="button" onClick={() => setLoc((l) => ({ ...l, pin: null }))} className={textLink}>
                      Remove
                    </button>
                  </p>
                </div>
              ) : (
                <div>
                  <button type="button" onClick={locate} disabled={locating} className={secondary}>
                    {locating ? "Finding your location…" : "Use my current location"}
                  </button>
                  <p className="mt-2 text-[0.875rem] text-stone">Best if you are standing at the spot now.</p>
                </div>
              )}
              <FieldError id={id("pin-err")}>{errors.pin}</FieldError>
            </div>

            <div className="max-w-sm">
              <Label htmlFor={id("lga")}>Local government area</Label>
              <select
                id={id("lga")}
                value={loc.lga}
                onChange={(e) => {
                  setLoc((l) => ({ ...l, lga: e.target.value }));
                  clear("lga");
                }}
                className={cn(field, "h-12")}
                {...err("lga")}
              >
                <option value="" disabled>
                  Select
                </option>
                {LAGOS_LGAS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <FieldError id={id("lga-err")}>{errors.lga}</FieldError>
            </div>

            <div>
              <Label htmlFor={id("landmark")} optional={!!loc.pin} hint="For example, Ojuwoye market road, by the bus stop">
                Street or landmark
              </Label>
              <input
                id={id("landmark")}
                value={loc.landmark}
                maxLength={160}
                onChange={(e) => {
                  setLoc((l) => ({ ...l, landmark: e.target.value }));
                  clear("landmark");
                }}
                className={cn(field, "h-12")}
                {...err("landmark")}
              />
              <FieldError id={id("landmark-err")}>{errors.landmark}</FieldError>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <fieldset>
              <legend className="mb-3 text-[0.9375rem] font-semibold text-ink">What is the problem?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {REPORT_TYPES.map((t) => (
                  <Choice key={t} name={id("type")} checked={details.type === t} onChange={() => setDetails((d) => ({ ...d, type: t }))}>
                    {t}
                  </Choice>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-[0.9375rem] font-semibold text-ink">Roughly how much waste?</legend>
              <div className="grid gap-2">
                {REPORT_SIZES.map((s) => (
                  <Choice key={s.value} name={id("size")} checked={details.size === s.value} onChange={() => setDetails((d) => ({ ...d, size: s.value }))} hint={s.hint.toLowerCase()}>
                    {s.value}
                  </Choice>
                ))}
              </div>
            </fieldset>

            <div>
              <Label htmlFor={id("description")} hint="What it is, how long it has been there, and whether it is blocking a road or drain.">
                Description
              </Label>
              <textarea
                id={id("description")}
                rows={4}
                maxLength={500}
                value={details.description}
                onChange={(e) => {
                  setDetails((d) => ({ ...d, description: e.target.value }));
                  clear("description");
                }}
                className={cn(field, "resize-y py-3 leading-relaxed")}
                {...err("description")}
              />
              <p className="mt-1 text-right text-[0.8125rem] text-stone tabular-nums">{details.description.trim().length} of 500 characters</p>
              <FieldError id={id("description-err")}>{errors.description}</FieldError>
            </div>

            <div className="border-t border-line-light pt-8">
              <h3 className="text-[1.0625rem] font-semibold text-ink">Your details</h3>
              <p className="mt-1 text-[0.875rem] text-stone">You can report without giving your name. Add a phone number if you want updates.</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor={id("name")} optional>
                    Name
                  </Label>
                  <input
                    id={id("name")}
                    value={details.name}
                    maxLength={80}
                    autoComplete="name"
                    onChange={(e) => {
                      setDetails((d) => ({ ...d, name: e.target.value }));
                      clear("name");
                    }}
                    className={cn(field, "h-12")}
                    {...err("name")}
                  />
                  <FieldError id={id("name-err")}>{errors.name}</FieldError>
                </div>
                <div>
                  <Label htmlFor={id("phone")} optional={!details.updates}>
                    Phone number
                  </Label>
                  <input
                    id={id("phone")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={20}
                    value={details.phone}
                    onChange={(e) => {
                      setDetails((d) => ({ ...d, phone: e.target.value }));
                      clear("phone");
                    }}
                    className={cn(field, "h-12 tabular-nums")}
                    {...err("phone")}
                  />
                  <FieldError id={id("phone-err")}>{errors.phone}</FieldError>
                </div>
              </div>
              <label className="mt-5 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={details.updates}
                  onChange={(e) => {
                    setDetails((d) => ({ ...d, updates: e.target.checked }));
                    clear("phone");
                  }}
                  className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-[var(--ink)]"
                />
                <span className="text-[0.9375rem] leading-relaxed text-ink">
                  Send me a text message when the report is assigned and when it is cleared
                </span>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <dl className="border-t border-line-light text-[0.9375rem]">
              {[
                ["Photos", `${photos.length} added`, 0],
                ["Location", [loc.landmark.trim(), loc.lga].filter(Boolean).join(", ") + (loc.pin ? " (location added)" : ""), 1],
                ["Problem", `${details.type}, ${details.size.toLowerCase()}`, 2],
                ["Description", details.description.trim(), 2],
                ["Updates", details.updates ? `Text messages to ${details.phone}` : "None", 2],
              ].map(([k, v, s]) => (
                <div key={k as string} className="grid grid-cols-[110px_1fr_auto] items-start gap-4 border-b border-line-light py-4 sm:grid-cols-[160px_1fr_auto]">
                  <dt className="font-semibold text-ink">{k}</dt>
                  <dd className="min-w-0 break-words text-ink/80">{v}</dd>
                  <button type="button" onClick={() => go(s as number)} className={cn(textLink, "text-[0.875rem]")}>
                    Change<span className="sr-only"> {String(k).toLowerCase()}</span>
                  </button>
                </div>
              ))}
            </dl>
            {photos.length > 0 && (
              <div className="mt-5 flex gap-3">
                {photos.map((p, i) => (
                  <img key={p.id} src={p.url} alt={`Photo ${i + 1} of the reported waste`} className="h-20 w-28 rounded-md object-cover" />
                ))}
              </div>
            )}
            <OfflineNote className="mt-8" />
          </div>
        )}
      </div>

      <div className="mt-10">
        <button type="button" onClick={step === 3 ? () => void send() : next} disabled={sending || reading} className={primary}>
          {sending ? "Sending…" : step === 3 ? "Send report" : "Continue"}
        </button>
      </div>
    </div>
  );
}

export function OfflineNote({ className }: { className?: string }) {
  return (
    <p className={cn("max-w-[60ch] text-[0.875rem] leading-relaxed text-stone", className)}>
      Online reporting goes live when LAWMA launches it across Lagos. Until then, reports sent here are kept in this browser and shown in the
      SmartWaste360 workspace on the same device. For anything urgent, call{" "}
      <a href="tel:617" className={textLink}>
        617
      </a>
      .
    </p>
  );
}

function Confirmation({
  report,
  updates,
  onAnother,
  headingRef,
  topRef,
}: {
  report: StoredReport;
  updates: string | null;
  onAnother: () => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
  topRef: RefObject<HTMLDivElement | null>;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report.ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy your reference number", report.ref);
    }
  };
  return (
    <div ref={topRef} className="scroll-mt-32">
      <div className="rounded-xl border border-ink/15 bg-card px-6 py-8 md:px-8">
        <h2 ref={headingRef} tabIndex={-1} className="text-[1.75rem] font-semibold leading-tight tracking-tight text-ink outline-none md:text-[2rem]">
          Report sent
        </h2>
        <p className="mt-5 text-[0.9375rem] text-stone">Your reference number</p>
        <p className="mt-1 text-[1.9rem] font-semibold tracking-wide text-ink tabular-nums md:text-[2.2rem]" aria-live="polite">
          {report.ref}
        </p>
        <button type="button" onClick={() => void copy()} className={cn(textLink, "mt-2 text-[0.875rem]")}>
          {copied ? "Copied" : "Copy reference number"}
        </button>
      </div>

      <h3 className="mt-10 text-[1.1875rem] font-semibold text-ink">What happens next</h3>
      <p className="mt-3 max-w-[60ch] text-[1rem] leading-relaxed text-ink/80">
        LAWMA customer care will review your report, usually within 30 minutes, and pass it to the collection operator for {report.area}.{" "}
        {updates
          ? `We will text ${updates} when a crew is assigned and again when the spot is cleared, with a photo.`
          : "To ask about it, call 617 and quote your reference number."}
      </p>

      <dl className="mt-8 border-t border-line-light text-[0.9375rem]">
        {[
          ["Problem", `${report.type}, ${report.size.toLowerCase()}`],
          ["Location", `${report.place}, ${report.area}`],
          ["Sent", new Date(report.raised).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-line-light py-4 sm:grid-cols-[160px_1fr]">
            <dt className="font-semibold text-ink">{k}</dt>
            <dd className="text-ink/80">{v}</dd>
          </div>
        ))}
      </dl>

      <OfflineNote className="mt-8" />

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="button" onClick={onAnother} className={secondary}>
          Report another problem
        </button>
        <Link to="/workspace" className={cn(textLink, "text-[0.9375rem]")}>
          View it in the SmartWaste360 workspace
        </Link>
      </div>
    </div>
  );
}
