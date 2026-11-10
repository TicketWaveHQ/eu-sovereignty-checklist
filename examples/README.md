# Examples

## `passing-project/`

A minimal, made-up project laid out the way the script's default
`SOVEREIGNTY_CONFIG` expects (a Next.js-style app on Vercel with Supabase and
Sentry). Every file holds just enough for its check to pass. It is a fixture,
not a template: copy the shape of the checks, not the files.

The `.env.local` in it holds a made-up Supabase project ref, not a real
project.

## `passing-run.json`

The JSON output of a run against `passing-project/`, generated from the
repository root with:

```bash
SOVEREIGNTY_JSON=1 SOVEREIGNTY_ROOT=examples/passing-project \
  node verify-sovereignty.mjs | sed '1,/^---JSON---$/d' > examples/passing-run.json
```

All 12 checks pass: Vercel region pinned, all three Sentry config files
carry the EU guard, Supabase project URL present (with the dashboard
verification reminder), public sub-processor disclosure page mentions
sovereignty, privacy page names the current auth provider, security
contact present, GDPR Articles 17 and 20 endpoints wired, CSP locked to
the EU telemetry host, and `X-Frame-Options: DENY` set.

## Console output (passing run)

```text
[PASS] Vercel region pinned to lhr1: regions = ["lhr1"]
[PASS] Sentry config (sentry.client.config.js) carries EU guard: contains de.sentry.io check
[PASS] Sentry config (sentry.server.config.js) carries EU guard: contains de.sentry.io check
[PASS] Sentry config (sentry.edge.config.js) carries EU guard: contains de.sentry.io check
[PASS] Supabase project URL present in .env.local: project ref = examplexyz (verify region in Supabase dashboard: must be eu-west-2)
[PASS] app/data-processors/page.js mentions sovereignty posture: sovereignty section present
[PASS] app/privacy/page.js is current: names "Supabase Auth" and contains no "Clerk" residue
[PASS] SECURITY.md present: vulnerability disclosure policy in place
[PASS] Data portability endpoint exists: app/api/account/export/route.js present
[PASS] Account deletion endpoint exists: app/api/account/delete/route.js present
[PASS] CSP connect-src targets Sentry EU host only: EU host in CSP; US default absent
[PASS] X-Frame-Options is DENY: set to DENY

Summary: 12 passed, 0 failed (12 checks recorded)
Run date: (time of the run)

Per the methodology (see README.md), append the outcome of
this check to your quarterly access review record.
```

The operator then pastes this output into the quarterly access review
record (e.g. `operations/access-reviews/2026-Q2.md`) and signs off.
