# Demand bill and payment audit review

## Management entry points
- Cadastre: **Open demand bills & audit**; each property also offers **Issue property bill** and **View property bills**.
- Revenue: **Open demand bills & audit**.
- PSP operators: **Open bill serial & payment audit**.

## Issue and print
Select the property, rooms, assigned collection PSP, first month and one or two months. Monthly rates, arrears and credits are copied into a retained issue-time snapshot. An LGA batch is all-or-nothing if an active bill overlaps its rooms and months. Preview a serial, then use **Print / save PDF** or **Print issued batch**. The four counterfoils are customer, bank/PSP, LAWMA and contractor copies. Voids retain the original serial and reason; pending or accepted receipt evidence prevents voiding.

## Reconcile
Record bank/teller evidence with the bill serial, property, PSP, destination, unique reference, value date and amount. Another named practice official accepts or rejects it. Only accepted evidence counts as collected. PSP declarations are cumulative revisions: the latest total replaces the earlier total for comparison without deleting history. Differences are review flags, not fraud findings or automatic enforcement. Open an exception and have another official record the finding.

## Verified with dummy records
- Issued a two-month Agege notice; all four parts fit on one A4 page.
- Blocked overlapping issue, mismatched property, duplicate teller reference, self-review and voiding an accepted-receipt bill.
- Accepted ₦70,000 evidence independently; compared against ₦20,000 PSP declaration, showing ₦50,000 difference; revised declaration to ₦70,000 and read back Matched.
- Independently reviewed the discrepancy exception.
- Issued an Ikeja batch, printed it, voided its serial and confirmed retained records after reload.
- Reached the same records from Cadastre, Revenue and PSP operators; checked phone layouts and light/dark appearances. No browser runtime errors.
- All 314 rule tests passed.

## Operational limits
Browser-only dummy register; not authenticated banking, official demand issuance or shared operational storage. Accounts are intentionally non-payable dummy references; legal citations are omitted pending authorised wording. Issuance and reconciliation never change existing room balances, allocate settlement shares, transfer funds, or derive collection income from weighbridge tonnage. The paper feedback boxes are retained on print but no satisfaction scoring or resident payment portal is implemented in this increment.