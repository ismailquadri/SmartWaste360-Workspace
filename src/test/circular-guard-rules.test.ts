import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(resolve(__dirname, '../../lawma/work/circular-guard-rules.js'), 'utf8');
const names = [...source.matchAll(/^const (\w+)=/gm)].map((m) => m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r = new Function(source + `;return {${names.join(',')}}`)() as any;

describe('non-linear circular transition & 7 forensic blindspot safeguards', () => {
  it('Blindspot 1: blocks outbound weighbills when hydraulic tailgate never opened or tipping dwell is under 240s', () => {
    expect(
      r.cgPhantomTippingError({
        inboundGrossKg: 22000,
        outboundTareKg: 10000,
        inTippingPolygon: true,
        tailgateOpened: false,
        ejectorCycled: false,
        dwellSeconds: 300,
      }),
    ).toContain('phantom discharge');

    expect(
      r.cgPhantomTippingError({
        inboundGrossKg: 22000,
        outboundTareKg: 10000,
        inTippingPolygon: true,
        tailgateOpened: true,
        ejectorCycled: true,
        dwellSeconds: 120,
      }),
    ).toContain('under 180s');

    expect(
      r.cgPhantomTippingError({
        inboundGrossKg: 22000,
        outboundTareKg: 10000,
        inTippingPolygon: true,
        tailgateOpened: true,
        ejectorCycled: true,
        dwellSeconds: 260,
      }),
    ).toBe('');
  });

  it('Brutal Reality 1: prevents small compactor trucks from hauling >25km directly to Epe WTE instead of using a TLS', () => {
    expect(
      r.cgDirectEpeCompactorError({
        vehicleType: 'Compactor',
        destination: 'Epe WTE',
        distanceKm: 68,
      }),
    ).toContain('route to Simpson or Oshodi TLS');

    expect(
      r.cgDirectEpeCompactorError({
        vehicleType: '40T_RoRo_Trailer',
        destination: 'Epe WTE',
        distanceKm: 68,
      }),
    ).toBe('');
  });

  it('Blindspot 2: rejects contaminated or wet bulk consignments at Epe WTE and assesses ₦150,000 demurrage', () => {
    const wet = r.cgEpeFeedstockRejection({
      transportMode: '40T_RORO_TRAILER',
      moisturePct: 58,
      inertRubblePct: 3,
      calorificMjKg: 8.2,
    });
    expect(wet).toEqual({
      rejected: true,
      reason: 'Moisture exceeds 45% boiler limit',
      demurrageNgn: 150000,
      divertTo: 'EPE_SANITARY_CELL',
    });

    const clean = r.cgEpeFeedstockRejection({
      transportMode: 'LAGOON_BARGE',
      moisturePct: 28,
      inertRubblePct: 2,
      calorificMjKg: 9.4,
    });
    expect(clean.rejected).toBe(false);
    expect(clean.divertTo).toBe('EPE_WTE_BUNKER');
  });

  it('Blindspot 3: flags Brazilian tenement room density under-declaration against LAGIS LiDAR footprint', () => {
    const scam = r.cgDensityUnderdeclared({
      category: 'MULTI_TENANT_TENEMENT',
      footprintM2: 360,
      storeys: 2,
      declaredRooms: 3,
    });
    expect(scam.flagged).toBe(true);
    expect(scam.expectedMin).toBe(25);
    expect(scam.reason).toContain('hold decal for Wole-Wole enumeration');

    const honest = r.cgDensityUnderdeclared({
      category: 'MULTI_TENANT_TENEMENT',
      footprintM2: 360,
      storeys: 2,
      declaredRooms: 22,
    });
    expect(honest.flagged).toBe(false);
  });

  it('Blindspot 4: issues 72-hour emergency fleet fuel barcodes when Friday NIBSS NIP settlement lags past 45 minutes', () => {
    const start = Date.parse('2026-11-13T12:00:00Z');
    const wait20 = r.cgEmergencyFuelVoucher(
      { id: 'BATCH-W46', status: 'PENDING_NIP', initiatedAt: '2026-11-13T12:00:00Z' },
      start + 20 * 60000,
    );
    expect(wait20.triggerVoucher).toBe(false);

    const lag50 = r.cgEmergencyFuelVoucher(
      { id: 'BATCH-W46', status: 'PENDING_NIP', initiatedAt: '2026-11-13T12:00:00Z' },
      start + 50 * 60000,
    );
    expect(lag50.triggerVoucher).toBe(true);
    expect(lag50.voucherStatus).toBe('ISSUED_72H_FUEL_BARCODE');
    expect(lag50.redeemableNetworks).toContain('NNPC');
  });

  it('Blindspot 5: enforces Section 84(2) Evidence Act pre-shift diagnostics, NTP clock sync, and Section 84(4) signature', () => {
    const validHash = 'a'.repeat(64);
    const badClock = r.cgSection84Ready({
      sha256: validHash,
      deviceSerial: 'R6-TERM-019',
      preShiftDiagPassed: true,
      ntpDriftMs: 12000,
      ordinaryCourseAttested: true,
      signingOfficer: 'Barr. A. Bello',
      signingOfficerRole: 'Director of Legal Services',
      digitalSignature: 'SIG-MEWR-8821',
    });
    expect(badClock.admissible).toBe(false);
    expect(badClock.errors[0]).toContain('Stratum-1 NTP clock drift');

    const admissible = r.cgSection84Ready({
      sha256: validHash,
      deviceSerial: 'R6-TERM-019',
      preShiftDiagPassed: true,
      ntpDriftMs: 180,
      ordinaryCourseAttested: true,
      signingOfficer: 'Barr. A. Bello',
      signingOfficerRole: 'Director of Legal Services',
      digitalSignature: 'SIG-MEWR-8821',
    });
    expect(admissible.admissible).toBe(true);
    expect(admissible.errors).toEqual([]);
  });

  it('Blindspot 6: splits border street Section 102 LCDA revenue by street-centerline PostGIS geometry', () => {
    const centerline = [
      [3.28, 6.55],
      [3.32, 6.55],
    ];
    expect(r.cgStreetSideAttribution([3.3, 6.551], centerline, 'Egbe-Idimu LCDA', 'Ikotun-Igando LCDA')).toBe(
      'Egbe-Idimu LCDA',
    );
    expect(r.cgStreetSideAttribution([3.3, 6.549], centerline, 'Egbe-Idimu LCDA', 'Ikotun-Igando LCDA')).toBe(
      'Ikotun-Igando LCDA',
    );
  });

  it('Blindspot 7: blocks pre-storm skip deployment completion without CDA Warden QR custody handshake', () => {
    expect(
      r.cgSkipCustodyError({
        skipId: 'SKIP-SUR-014',
        basinId: 'SYS-63-SURULERE',
        cdaChairmanName: '',
        cdaPhone: '',
        qrScannedAt: '',
        geofenceVerified: true,
      }),
    ).toContain('CDA Warden QR custody handshake');

    expect(
      r.cgSkipCustodyError({
        skipId: 'SKIP-SUR-014',
        basinId: 'SYS-63-SURULERE',
        cdaChairmanName: 'Alhaji K. Oseni',
        cdaPhone: '+2348032219988',
        qrScannedAt: '2026-11-16T08:30:00Z',
        geofenceVerified: true,
      }),
    ).toBe('');
  });

  it('Non-Linear Target: verifies statewide mass-balance diversion against the <=4% landfill residual target', () => {
    const current = r.cgNonLinearMassBalance({
      mrfTonnes: 1840,
      epeWteTonnes: 2910,
      biodigesterTonnes: 3420,
      landfillResidualTonnes: 5070,
    });
    expect(current.totalTonnes).toBe(13240);
    expect(current.meetsNonLinearTarget).toBe(false);

    const targetState = r.cgNonLinearMassBalance({
      mrfTonnes: 3800,
      epeWteTonnes: 4200,
      biodigesterTonnes: 4600,
      landfillResidualTonnes: 400,
    });
    expect(targetState.landfillPct).toBe(3.1);
    expect(targetState.meetsNonLinearTarget).toBe(true);
  });
});
