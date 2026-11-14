import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(__dirname, '../../lawma/work/modules.js'), 'utf8');
const start = source.indexOf('function openFleetDistrict(');
const end = source.indexOf('\nfunction bindModules()', start);
const helper = source.slice(start, end);

function setup(allowed = true) {
  const state = { query: 'FLT-0042', district: 'Yaba', status: 'No signal', viewport: true, page: 4, view: 'review', selected: 42 };
  const controls: Record<string, { value: string; hidden: boolean; checked: boolean; focus: () => void }> = {};
  const calls: unknown[] = [];
  const $ = (id: string) => controls[id] ||= { value: 'old', hidden: false, checked: true, focus: () => calls.push('focus') };
  const open = new Function('state', '$', 'permitted', 'ROUTES', 'toast', 'closeDetail', 'goJourney', 'changeFilter', `${helper}; return openFleetDistrict;`)(
    state, $, () => allowed, [{ name: 'Yaba' }, { name: 'Lekki' }], (s: string) => calls.push(s),
    () => { state.selected = 0; calls.push('close'); }, (p: string) => calls.push(p), (fit: boolean) => calls.push(fit),
  ) as (district: string) => void;
  return { state, controls, calls, open };
}

describe('LGA fleet drill-down', () => {
  it('opens the selected district with all competing filters cleared and fits the map', () => {
    const { state, controls, calls, open } = setup();
    open('Lekki');
    expect(state).toEqual({ query: '', district: 'Lekki', status: 'all', viewport: false, page: 0, view: 'fleet', selected: 0 });
    expect(controls['district']?.value).toBe('Lekki');
    expect(controls['search']?.value).toBe('');
    expect(controls['viewportOnly']?.checked).toBe(false);
    expect(calls).toEqual(['close', 'fleet', true, 'focus']);
  });
  it('opens all districts from the total row', () => {
    const { state, open } = setup();
    open('all');
    expect(state.district).toBe('all');
  });
  it('does not navigate for officials without fleet access', () => {
    const { state, calls, open } = setup(false);
    open('Lekki');
    expect(state.district).toBe('Yaba');
    expect(calls).toEqual([]);
  });
  it('does not silently show another district for an unknown sample area', () => {
    const { state, calls, open } = setup();
    open('Unknown');
    expect(state.district).toBe('Yaba');
    expect(calls).toHaveLength(1);
    expect(calls).not.toContain('fleet');
  });
});