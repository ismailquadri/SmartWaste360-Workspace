# LAWMA SmartWaste360 management

Public LAWMA website and management workspace, built with React, TanStack Start, Vite and Nitro. Production: https://lawma-360-v2.vercel.app.

## Development and validation

Use Node.js 24 and npm.

```sh
npm ci
python3 lawma/build_dashboard.py
npm run dev
npm run build
npm test
```

The standalone dashboard sources are in `lawma/work/`; commit regenerated `public/dashboard.html`. The workspace lives at `/workspace`.

## Deployment

The `main` branch deploys to the existing Vercel project `lawma-360-v2`. Nitro generates `.vercel/output`; the build uses `NITRO_PRESET=vercel npm run build`.

## Data and translations

This management export uses browser-local prototype data and has no configured remote database, database credentials, or database migration scripts. Publishing this app does not migrate any external database. A live-data migration requires access to the source database/export and a destination database plus its connection settings.

The checked-in translation dictionaries work without credentials. To regenerate them, install Python `requests`, run `python3 scripts/i18n/extract.py`, then set `TRANSLATION_API_URL` (an OpenAI-compatible chat completions endpoint), `TRANSLATION_API_KEY`, and `TRANSLATION_MODEL` before running `python3 scripts/i18n/translate.py`. These are optional development variables, never browser variables.
