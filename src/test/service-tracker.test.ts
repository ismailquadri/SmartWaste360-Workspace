import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The dashboard is vanilla JS; pull the tracker rules out of its source and evaluate them in isolation.
const source = readFileSync(resolve(__dirname, "../../lawma/work/simulation.js"), "utf8");
const pick = (name: string) => {
  const line = source.split("\n").find((l) => l.startsWith(`const ${name}=`));
  if (!line) throw new Error(`${name} not found in simulation.js`);
  return line;
};

type Order = { stage: string };
function load(tripState: string | null) {
  const body = [
    "let facilityProgress=()=>tripState;",
    pick("facilityNextLabel"),
    pick("simNext"),
    pick("serviceTrackerStep"),
    pick("serviceStageLabel"),
    "return {simNext,serviceTrackerStep,serviceStageLabel};",
  ].join("\n");
  return new Function("tripState", body)(tripState) as {
    simNext: (o: Order) => string;
    serviceTrackerStep: (o: Order) => number;
    serviceStageLabel: (o: Order) => string;
  };
}

// Steps: 0 Assign, 1 Collect, 2 Facility, 3 Receipt, 4 = all done.
describe("service record step tracker", () => {
  it("highlights Collect once the route has started", () => {
    expect(load(null).serviceTrackerStep({ stage: "Collecting" })).toBe(1);
  });

  it("highlights Facility after collection and while the truck is checked in", () => {
    expect(load(null).serviceTrackerStep({ stage: "Collected" })).toBe(2);
    expect(load("Checked in").serviceTrackerStep({ stage: "At facility" })).toBe(2);
    expect(load("At weighbridge").serviceTrackerStep({ stage: "At facility" })).toBe(2);
  });

  it("ticks Facility and highlights Receipt once the weight is recorded", () => {
    expect(load("Weighed").serviceTrackerStep({ stage: "At facility" })).toBe(3);
    expect(load("Unloading").serviceTrackerStep({ stage: "At facility" })).toBe(3);
  });

  it("shows every step done once the receipt is issued", () => {
    expect(load("Unloaded").serviceTrackerStep({ stage: "Verified" })).toBe(4);
  });

  it("names the facility step in the record's current stage and next action", () => {
    const weighed = load("Weighed");
    expect(weighed.serviceStageLabel({ stage: "At facility" })).toBe("At facility · Weighed");
    expect(weighed.simNext({ stage: "At facility" })).toBe("Start unloading");
  });
});
