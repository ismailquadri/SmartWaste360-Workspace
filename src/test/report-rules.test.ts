import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import {
  REFERENCE_PATTERN,
  SITE_REPORTS_KEY,
  detailsSchema,
  inLagos,
  locationSchema,
  makeReference,
  maskPhone,
  photosSchema,
  toStoredReport,
} from "@/lib/site/report";

const photo = { name: "dump.jpg", type: "image/jpeg", size: 2_000_000 };
const details = { type: "Illegal dump", size: "Large", description: "Heap of refuse blocking the drain", name: "", phone: "", updates: false } as const;

describe("Dumping report rules", () => {
  it("needs at least one photo and allows at most three", () => {
    expect(photosSchema.safeParse([]).success).toBe(false);
    expect(photosSchema.safeParse([photo]).success).toBe(true);
    expect(photosSchema.safeParse([photo, photo, photo, photo]).success).toBe(false);
  });

  it("only accepts image files under 15 MB", () => {
    expect(photosSchema.safeParse([{ ...photo, type: "application/pdf" }]).success).toBe(false);
    expect(photosSchema.safeParse([{ ...photo, size: 16 * 1024 * 1024 }]).success).toBe(false);
  });

  it("needs a street or landmark when no pin is dropped", () => {
    expect(locationSchema.safeParse({ lga: "Mushin", landmark: "", pin: null }).success).toBe(false);
    expect(locationSchema.safeParse({ lga: "Mushin", landmark: "Ojuwoye market road", pin: null }).success).toBe(true);
    expect(locationSchema.safeParse({ lga: "Mushin", landmark: "", pin: { lat: 6.527, lng: 3.35 } }).success).toBe(true);
  });

  it("rejects a pin outside Lagos and an unknown council area", () => {
    expect(inLagos(9.07, 7.49)).toBe(false); // Abuja
    expect(locationSchema.safeParse({ lga: "Mushin", landmark: "Somewhere", pin: { lat: 9.07, lng: 7.49 } }).success).toBe(false);
    expect(locationSchema.safeParse({ lga: "Abuja", landmark: "Somewhere", pin: null }).success).toBe(false);
  });

  it("needs a description of 10 to 500 characters", () => {
    expect(detailsSchema.safeParse({ ...details, description: "Refuse" }).success).toBe(false);
    expect(detailsSchema.safeParse({ ...details, description: "x".repeat(501) }).success).toBe(false);
    expect(detailsSchema.safeParse(details).success).toBe(true);
  });

  it("needs a valid Nigerian mobile number to send updates", () => {
    expect(detailsSchema.safeParse({ ...details, updates: true }).success).toBe(false);
    expect(detailsSchema.safeParse({ ...details, phone: "12345" }).success).toBe(false);
    expect(detailsSchema.safeParse({ ...details, phone: "0803 123 4412", updates: true }).success).toBe(true);
    expect(detailsSchema.safeParse({ ...details, phone: "+2348031234412", updates: true }).success).toBe(true);
  });

  it("issues references as LAW-YYMMDD-XXXX and never repeats one", () => {
    const day = new Date(2026, 9, 29, 8, 20);
    const ref = makeReference(day, [], () => 0);
    expect(ref).toBe("LAW-261029-2222");
    expect(ref).toMatch(REFERENCE_PATTERN);
    let n = 0;
    const next = makeReference(day, [ref], () => (n++ < 4 ? 0 : 0.5));
    expect(next).not.toBe(ref);
    expect(next).toMatch(REFERENCE_PATTERN);
  });

  it("masks the reporter's phone number for the workspace", () => {
    expect(maskPhone("0803 123 4412")).toBe("0803 ••• 4412");
    expect(maskPhone("+2348031234412")).toBe("0803 ••• 4412");
    const r = toStoredReport("LAW-261029-2222", new Date(), { lga: "Mushin", landmark: "", pin: { lat: 6.5, lng: 3.35 } }, { ...details, phone: "08031234412" }, null);
    expect(r.reporter).toBe("Resident · 0803 ••• 4412");
    expect(r.coord).toEqual([3.35, 6.5]);
  });

  it("uses the same storage key as the workspace inbox", () => {
    const hub = readFileSync("lawma/work/hub.js", "utf8");
    expect(hub).toContain(`const SITE_REPORTS_KEY='${SITE_REPORTS_KEY}';`);
  });

  it("lands in the workspace inbox as a new Website alarm under the same reference", () => {
    const hub = readFileSync("lawma/work/hub.js", "utf8");
    const line = hub.split("\n").find((l) => l.startsWith("const siteReportToHub="));
    const toHub = new Function(`${line}\nreturn siteReportToHub;`)();
    const stored = toStoredReport("LAW-261029-2222", new Date(), { lga: "Mushin", landmark: "Ojuwoye market road", pin: null }, details, "javascript:alert(1)");
    const alarm = toHub(stored);
    expect(alarm).toMatchObject({ id: "LAW-261029-2222", channel: "Website", area: "Mushin", type: "Illegal dump", note: details.description });
    expect(alarm.photoUrl).toBeNull();
    expect(alarm.status).toBeUndefined();
  });
});
