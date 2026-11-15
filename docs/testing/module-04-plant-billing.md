# MOD-04 safeguard 2 — two-tier heavy plant billing

## Delivered

Dumpsite capacity → Heavy plant replaces the previous full-rate-hours-only table with a two-tier invoice register and a selected-machine ledger.

- Verified inside-fence engine load at or above 25%: 100% hourly base rate.
- Verified inside-fence load below 25%, machine serviceable/ready and operator present/ready: 35% base rate.
- Unverified, outside-fence or unavailable periods: zero billing. Compaction never also counts as standby.
- Lagos-time period entry rejects overlap, reversed dates and intervals longer than 24 hours. Duplicate evidence references are rejected per machine.
- Contract rate, invoice and review records persist locally. Historical decisions retain calculated tier amounts, invoice, rate, approved amount and revision. New inputs require fresh review.
- Invoices above calculated amounts by more than the existing 5% tolerance are flagged held. An officer may approve only the lower of the calculated amount and submitted invoice, or query the lessor for zero approval. No payment is made.
- Original plant logs and legacy reviews remain untouched. Legacy low-load periods are not presumed ready standby. The initial ₦120,000/hour base rate and converted legacy invoice are clearly illustrative dummy assumptions.

## Verification

Browser tested with a fresh Management practice sign-in, using actual forms: changed rate to ₦100,000; captured one hour at exactly 25%; two hours verified ready standby; rejected overlapping capture; captured unavailable, outside-fence and unverified periods; recorded an invoice and approved the calculation. Total was ₦1,020,000: ₦950,000 active (8.5 legacy hours plus 1 new hour) and ₦70,000 standby. Approval did not include the ₦180,000 invoice excess. Legacy source records remained three logs.

Reload preserved telemetry evidence, contract, invoice and approval. A subsequent rate change marked the old review as a previous revision; a lessor query survived another reload. Desktop and phone checked; no page overflow or browser errors. All 206 automated tests passed.

Dummy-only: no live CAN-bus evidence, contract authority, bank payments or authenticated staff identities. LAWMA approval and operational acceptance remain outstanding. Safeguards 3–5 remain queued separately.