import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LAGOS_LGAS } from '../lib/site/report';

const source = readFileSync(resolve(__dirname, '../../lawma/work/simulation.js'), 'utf8');
const helper = source.slice(source.indexOf('const OVERVIEW_LGAS ='), source.indexOf('function renderOverviewAreas()'));
type Row = { name: string; total: number; working: number; lost: number; cases: number; collected: number; tipped: number; district: string | null; placeholder: boolean };
const districts = ['Ikeja', 'Yaba', 'Surulere', 'Lagos Island', 'Lekki', 'Agege', 'Oshodi', 'Alimosho', 'Apapa'];
function rows() {
  return new Function('fleet', 'modules', `${helper}; return overviewLgaRows();`)(
    districts.map(district => ({ district, status: 'On route', reported: 10, verified: 8 })),
    { incidents: [{ area: 'Yaba', status: 'Open' }] },
  ) as Row[];
}
describe('Statewide overview LGA figures', () => {
  it('shows exactly all 20 official Lagos LGAs without district duplicates', () => {
    expect(rows().map(r => r.name)).toEqual([...LAGOS_LGAS]);
    expect(rows()).toHaveLength(20);
  });
  it('provides nonzero sample figures for each of the 11 LGAs without sample trucks', () => {
    const samples = rows().filter(r => r.placeholder);
    expect(samples).toHaveLength(11);
    samples.forEach(r => {
      expect(r.total).toBeGreaterThan(0);
      expect(r.collected).toBeGreaterThan(0);
      expect(r.tipped).toBeGreaterThan(0);
      expect(r.working + r.lost).toBeLessThanOrEqual(r.total);
      expect(r.tipped).toBeLessThanOrEqual(r.collected);
      expect(r.district).toBeNull();
    });
  });
  it('retains fleet-derived figures and maps official names to the correct sample districts', () => {
    for (const [name, district] of [['Lagos Mainland', 'Yaba'], ['Eti-Osa', 'Lekki'], ['Oshodi-Isolo', 'Oshodi']]) {
      expect(rows().find(r => r.name === name)).toMatchObject({ district, total: 1, collected: 6, tipped: 5, placeholder: false });
    }
    expect(rows().find(r => r.name === 'Lagos Mainland')?.cases).toBe(1);
  });
});