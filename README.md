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
- Dev mode logs the submitted lead server-side and returns a local capture message
- When Resend is configured, the API sends the lead email using:
  - `RESEND_API_KEY`
  - `RUNBOOK_LEADS_TO_EMAIL`
  - `RUNBOOK_LEADS_FROM_EMAIL`

Local development values live in `.env.local`. Keep `RESEND_API_KEY` blank unless you are intentionally testing email delivery.

## Production Email Setup

- Verify the sending domain in Resend before launch
- Set these environment variables in Vercel:
  - `RESEND_API_KEY`
  - `RUNBOOK_LEADS_TO_EMAIL`
  - `RUNBOOK_LEADS_FROM_EMAIL`

Recommended production values:

```bash
RUNBOOK_LEADS_TO_EMAIL=ap@tenmfg.com
RUNBOOK_LEADS_FROM_EMAIL=RunBook <demo@your-runbook-domain.com>
```
