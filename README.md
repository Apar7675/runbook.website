# RunBook Website

RunBook public marketing website.

## Local Dev

```bash
cd D:\runbook.website
npm install
npm run dev -- -p 3005
```

Open `http://localhost:3005` in your browser.

## Request Demo Form

- POSTs to `/api/request-demo`
- If `RESEND_API_KEY` is blank, the app runs in dev mode
- Dev mode records only a non-PII request correlation event; it does not retain or send lead details
- When Resend is configured, the API sends the lead email using:
  - `RESEND_API_KEY`
  - `RUNBOOK_LEADS_TO_EMAIL`
  - `RUNBOOK_LEADS_FROM_EMAIL`

Local development values live in `.env.local`. Keep `RESEND_API_KEY` blank unless you are intentionally testing email delivery.

## Production Email Setup

- Verify the sending domain in Resend before launch
- Set these environment variables in the deployment platform:
  - `RESEND_API_KEY`
  - `RUNBOOK_LEADS_TO_EMAIL`
  - `RUNBOOK_LEADS_FROM_EMAIL`

Synthetic configuration example (replace through the deployment environment):

```bash
RUNBOOK_LEADS_TO_EMAIL=leads@example.invalid
RUNBOOK_LEADS_FROM_EMAIL=RunBook <demo@example.invalid>
```

Do not commit real mail credentials or recipient identifiers.

## Production Artifact Boundary

Run `npm run build` and then `npm run verify:deployment`.

The reviewed deployment inputs are:

- `.next/standalone`
- `.next/static`
- `public`

Do not deploy the complete `.next` directory. Development output, caches, logs, local environment files, and repository metadata are not release artifacts.
