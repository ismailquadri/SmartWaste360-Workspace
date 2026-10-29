# Plan: Management hub additions for LAWMA

Scope: the management, government and agency hub only. The customer app is handled separately afterwards. Everything stays clickable on one device; live connections, real logins and shared records follow after LAWMA signs. No prototype wording on screen.

## Not included (by decision)
- Tracking the 160 new compactor trucks or other one-off announcements.
- A public "proof against old viral videos" page.
- Pricing model (per pickup vs monthly operator billing): needs LAWMA's answer, nothing to build yet.

## 1. Public dump alarms (new "Public reports" workspace)
Reports raised by residents (customer app, WhatsApp or USSD) land here.
- **Inbox:** each alarm shows type (illegal dump, overflowing public bin, blocked drain, market waste), photo, location, area, channel, time raised and age.
- **Map:** alarms pinned on the existing map; repeat reports in the same spot are grouped as a hotspot.
- **Actions:** acknowledge, assign to the operator serving that zone, dispatch a crew, mark cleared with a photo, or close as duplicate.
- **Reporter updates:** every step shows the message sent back to the reporter (Received, Team assigned, Cleared), so the round trip is visible.
- **Escalation:** an alarm not acknowledged within a set time turns red and appears on the Overview; a dump with an identified offender can be sent to Enforcement as a case.
- Visible to Management, Operations supervisor, Customer care and Enforcement; the Inbox bell shows new alarms.
- A new guided scenario walks through: alarm arrives, assigned, crew clears it, reporter notified.

## 2. WhatsApp and USSD channels
- Reports in the inbox carry their channel (App, WhatsApp, USSD) with a channel filter.
- New "Resident channels" panel on Platform health: a preview of the USSD menu (report a dump, check pickup, pay bill), a WhatsApp conversation preview, and language options English, Yoruba and Pidgin.
- Channel volume and response times appear on the Customer care page.
- The USSD short code and WhatsApp number shown are placeholders until LAWMA provides real ones.

## 3. Service backlog view for leadership
On Overview for Management:
- Days since last pickup by area, with a colour-coded area list and map shading.
- Overdue collections and open alarms per collection operator, with an on-time score.
- "Move work" action: reassign an area's overdue work from an underperforming operator to another, recorded in the activity log.

## 4. Markets and businesses
- New account type for markets and businesses alongside households.
- Market sanitation windows (for example 6:00 to 8:30 AM) with scheduled clean-ups and a check that each one happened.
- Commercial invoices on the Revenue page, separate from household bills.

## 5. Dumpsite queue and turnaround
On Facilities:
- Live queue at each site (Olusosun first): trucks waiting, average wait, longest wait.
- Travel time from last pickup to the gate, and gate-to-exit time.
- A warning when waiting exceeds a set limit, shown to Operations and Facility staff.

## 6. Separate the customer side from the hub
- Remove the "Resident" role and its "My service" pages from the hub's "View as" list, and the phone-style install shell, so the hub only serves staff and agencies.
- Residents appear in the hub only as the people behind reports, requests and accounts.

## Order of work
1. Public dump alarms (1) with channel tags (2).
2. Service backlog view (3).
3. Dumpsite queue (5).
4. Markets and businesses (4).
5. Separation (6), then a full light, dark and phone-size check of every screen and scenario.
6. Ask about the customer app: report screen, alarm status and WhatsApp/USSD flows there.

## After LAWMA approval (not in this round)
Real staff logins and roles, shared records across devices, payments, SMS/WhatsApp/USSD providers, and connection to LAWMA's property, operator-zone and billing records.

## Technical details
- All work stays in `lawma/work/` sources and is rebuilt into `public/dashboard.html` with `lawma/build_dashboard.py`.
- New records (`publicReports`, `marketAccounts`, `siteQueue`) are added to `module-data.js` seed data with a version bump so saved sessions reset cleanly.
- New page added to `journeyNav` and `personaPages`; views and actions go in `modules.js`; styling only through `scouts-theme.css`.
- Alarm status rules (acknowledge time limit, allowed transitions, reporter message per status) get unit tests next to `src/test/service-tracker.test.ts`.
