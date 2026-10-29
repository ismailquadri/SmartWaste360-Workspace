import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The hub additions are vanilla JS; evaluate their rule constants in isolation.
const source = readFileSync(resolve(__dirname, "../../lawma/work/hub.js"), "utf8");
const pick = (name: string) => {
  const line = source.split("\n").find((l) => l.startsWith(`const ${name}=`));
  if (!line) throw new Error(`${name} not found in hub.js`);
  return line;
};
const names = [
  "ALARM_ACK_LIMIT_MIN",
  "ALARM_STEPS",
  "alarmFlow",
  "alarmCanMove",
  "alarmOverdue",
  "alarmChannelRoute",
  "alarmMessage",
  "backlogLevel",
  "QUEUE_WAIT_LIMIT_MIN",
  "queueWarning",
  "monthlyInvoice",
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rules = new Function([...names.map(pick), `return {${names.join(",")}};`].join("\n"))() as any;

const minutesAgo = (now: number, m: number) => new Date(now - m * 60000).toISOString();

describe("public dump alarms", () => {
  it("turns red when not acknowledged within 30 minutes", () => {
    const now = Date.parse("2026-10-04T09:00:00Z");
    expect(rules.alarmOverdue({ status: "New", raised: minutesAgo(now, 29) }, now)).toBe(false);
    expect(rules.alarmOverdue({ status: "New", raised: minutesAgo(now, 31) }, now)).toBe(true);
  });

  it("stops being overdue once acknowledged", () => {
    const now = Date.parse("2026-10-04T09:00:00Z");
    expect(rules.alarmOverdue({ status: "Acknowledged", raised: minutesAgo(now, 90) }, now)).toBe(false);
  });

  it("moves only Received → Acknowledged → Assigned → Crew on site → Cleared", () => {
    expect(rules.alarmCanMove("New", "Acknowledged")).toBe(true);
    expect(rules.alarmCanMove("New", "Cleared")).toBe(false);
    expect(rules.alarmCanMove("Assigned", "Crew on site")).toBe(true);
    expect(rules.alarmCanMove("Crew on site", "Cleared")).toBe(true);
    expect(rules.alarmCanMove("Cleared", "Assigned")).toBe(false);
  });

  it("allows a duplicate only before an operator is assigned", () => {
    expect(rules.alarmCanMove("Acknowledged", "Duplicate")).toBe(true);
    expect(rules.alarmCanMove("Assigned", "Duplicate")).toBe(false);
  });

  it("replies on the channel the resident used; USSD replies by SMS", () => {
    expect(rules.alarmChannelRoute("WhatsApp")).toBe("WhatsApp message");
    expect(rules.alarmChannelRoute("USSD")).toBe("SMS");
    expect(rules.alarmChannelRoute("App")).toBe("App notification");
  });

  it("tells the reporter the spot was cleared, with the time and a photo", () => {
    const msg = rules.alarmMessage({ id: "PUB-001", place: "Ojuwoye market road", clearedTime: "10:42" }, "Cleared");
    expect(msg).toContain("PUB-001");
    expect(msg).toContain("10:42");
    expect(msg).toContain("photo");
  });
});

describe("service backlog", () => {
  it("is overdue from 3 days and critical from 7 days since the last pickup", () => {
    expect(rules.backlogLevel(2)).toBe("On schedule");
    expect(rules.backlogLevel(3)).toBe("Overdue");
    expect(rules.backlogLevel(6)).toBe("Overdue");
    expect(rules.backlogLevel(7)).toBe("Critical");
  });
});

describe("disposal site queue", () => {
  it("warns once any truck has waited more than 45 minutes", () => {
    expect(rules.queueWarning([12, 45])).toBe(false);
    expect(rules.queueWarning([12, 46])).toBe(true);
  });
});

describe("market and business billing", () => {
  it("bills the account's monthly fee once per month", () => {
    const inv = rules.monthlyInvoice({ id: "MKT-001", monthly: 180000 }, "October 2026");
    expect(inv.amount).toBe(180000);
    expect(inv.period).toBe("October 2026");
    expect(inv.basis).toBe("Monthly service");
  });
});
