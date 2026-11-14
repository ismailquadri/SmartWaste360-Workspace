import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const source = readFileSync(resolve(__dirname, '../../lawma/work/fleet-map-rules.js'), 'utf8');
const names = [...source.matchAll(/^const (\w+)=/gm)].map(m => m[1]);
const rules = new Function(source + `;return {${names.join(',')}}`)();
describe('dummy fleet oversight', () => {
  const snapshot = '2026-11-14T16:44:00Z';
  const now = Date.parse(snapshot);
  it('ages the original snapshot without inventing new positions', () => {
    expect(rules.fleetPositionAge({ age: 12 }, snapshot, now + 10000)).toBe(22);
    expect(rules.fleetPositionState({ age: 299 }, snapshot, now)).toBe('Recent position');
    expect(rules.fleetPositionState({ age: 300 }, snapshot, now)).toBe('Stale position');
    expect(rules.fleetPositionState({ age: 900 }, snapshot, now)).toBe('Missing update');
    expect(rules.fleetPositionState({ age: 5, status: 'No signal' }, snapshot, now)).toBe('Missing update');
  });
  it('links saved assignments and only explicitly mapped manifests', () => {
    const records = rules.fleetLinkedRecords('FLT-0042', [{ id: 'ASG-1', vehicle: 'FLT-0042' }, { id: 'ASG-2', vehicle: 'FLT-0043' }], [{ id: 'MAN-201', mapVehicle: 'FLT-0042' }, { id: 'MAN-202', district: 'Ikeja' }], [{ manifest: 'MAN-201', slot: 120 }, { manifest: 'MAN-202', slot: 240 }], [{ ref: 'ASG-1', outcome: 'Approved' }, { ref: 'ASG-2', outcome: 'Approved' }]);
    expect(records.assignments.map((r: { id: string }) => r.id)).toEqual(['ASG-1']);
    expect(records.manifests.map((r: { id: string }) => r.id)).toEqual(['MAN-201']);
    expect(records.bookings.map((r: { slot: number }) => r.slot)).toEqual([120]);
    expect(records.reviews.map((r: { ref: string }) => r.ref)).toEqual(['ASG-1']);
  });
  it('intersects PSP, freshness and exception filters', () => {
    const v = { partnerId: 'PAR-001', positionState: 'Stale position', exceptions: [{ kind: 'Breakdown' }] };
    expect(rules.fleetMapMatches(v, { psp: 'PAR-001', freshness: 'Stale position', exception: 'Breakdown', onlyExceptions: true })).toBe(true);
    expect(rules.fleetMapMatches(v, { psp: 'PAR-002', freshness: 'all', exception: 'all', onlyExceptions: false })).toBe(false);
    expect(rules.fleetMapMatches({ ...v, exceptions: [] }, { psp: 'all', freshness: 'all', exception: 'all', onlyExceptions: true })).toBe(false);
  });
  it('puts breakdowns before evidence reviews and clear vehicles', () => {
    const vehicles = [{ id: 1, exceptions: [] }, { id: 2, exceptions: [{ kind: 'Evidence review' }] }, { id: 3, exceptions: [{ kind: 'Breakdown' }] }];
    expect(vehicles.sort((a, b) => rules.fleetExceptionRank(a) - rules.fleetExceptionRank(b)).map(v => v.id)).toEqual([3, 2, 1]);
  });
});