# EU/UK Sovereignty Checklist

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/TicketWaveHQ/eu-sovereignty-checklist)](https://github.com/TicketWaveHQ/eu-sovereignty-checklist/commits/main)
[![Contributors](https://img.shields.io/github/contributors/TicketWaveHQ/eu-sovereignty-checklist)](https://github.com/TicketWaveHQ/eu-sovereignty-checklist/graphs/contributors)

**What it is:** a quarterly checklist ([`CHECKLIST.md`](CHECKLIST.md)) and a
zero-dependency Node.js script ([`verify-sovereignty.mjs`](verify-sovereignty.mjs))
for keeping a UK/EU SaaS on **EEA/UK-sovereign infrastructure**. The script
checks what can be checked from your repository (region pins, EU telemetry
hosts, disclosure pages, GDPR endpoints, headers); the checklist covers the
rest (admin consoles, signed DPAs, vendor attestations). Run it quarterly,
and whenever a vendor or a region changes.

**Who it is for:** engineers and operators of a UK or EU service that
processes personal data, who need to show (to a customer, a procurement
questionnaire or their own board) where that data lives and which vendors
touch it.

Published under **CC BY 4.0** so you can lift it, edit it, and use it,
commercially too, without asking. In return the licence asks for credit:
name the source, link the licence, and say if you changed it.

## 60-second start

You need Node.js 18 or newer and nothing else.

```bash
git clone https://github.com/TicketWaveHQ/eu-sovereignty-checklist.git
cd eu-sovereignty-checklist

# 1. See a passing run against the bundled fixture project.
SOVEREIGNTY_ROOT=examples/passing-project node verify-sovereignty.mjs

# 2. Point it at your own project. Expect FAILs until you edit the
#    SOVEREIGNTY_CONFIG block at the top of the script to match your stack.
SOVEREIGNTY_ROOT=/path/to/your-project node verify-sovereignty.mjs
```

Then work through [`CHECKLIST.md`](CHECKLIST.md) for the items a script
cannot see.

---

## Table of contents

- [60-second start](#60-second-start)
- [Why this exists](#why-this-exists)
- [Used in production](#used-in-production)
- [The five principles](#the-five-principles)
  - [Principle 1: EEA/UK-sovereign by default](#principle-1-eeauk-sovereign-by-default)
  - [Principle 2: Region pinning is explicit](#principle-2-region-pinning-is-explicit)
  - [Principle 3: Sub-processor disclosure](#principle-3-sub-processor-disclosure)
  - [Principle 4: Quarterly verification](#principle-4-quarterly-verification)
  - [Principle 5: Documented exceptions](#principle-5-documented-exceptions)
- [Using the script](#using-the-script)
- [Reference implementation](#reference-implementation)
- [What the script checks](#what-the-script-checks)
- [Tailoring the script](#tailoring-the-script)
- [What this is not](#what-this-is-not)
- [Related](#related)
- [Maintainer](#maintainer)
- [License](#license)

---

## Why this exists

If you run a UK or EU SaaS that processes personal data, three forces push
you toward keeping that data in the EEA or the UK by default:

1. **UK GDPR compliance.** An EEA/UK-only sub-processor mix removes the
   complexity of cross-border transfer mechanisms (UK IDTA, SCCs, adequacy
   decisions) and reduces the surface for compliance failures.
2. **Procurement.** UK public-sector buyers - schools, councils, MATs,
   universities, NHS trusts, charities - increasingly require named
   EEA/UK-only data flows in supplier questionnaires. A sovereign posture
   wins more procurement responses.
3. **Optionality and resilience.** US CLOUD Act, FISA 702, and evolving
   transfer-mechanism case law (Schrems II/III) create periodic regulatory
   surprises for US-hosted dependencies. Avoiding them is operationally
   simpler than managing them.

This repo is what I codify around those three forces.

---

## Used in production

The methodology behind the sovereignty posture of the TicketWave HQ estate: [ticketwavehq.com](https://ticketwavehq.com), whose public [data-processors register](https://ticketwavehq.com/data-processors) reflects it, and the brand sites [veryseoly.com](https://veryseoly.com), [jortech.co.uk](https://www.jortech.co.uk) and [dacros.com](https://dacros.com).

---

## The five principles

Each is a rule, not an aspiration. The script in this repo verifies most
of them mechanically; the rest are checklist items you confirm in
admin dashboards.

### Principle 1: EEA/UK-sovereign by default

Every sub-processor that processes identifying personal data must, by
default, host that processing in the EEA or the UK. Any exception is
justified in writing, listed on the public sub-processor disclosure
page, and reviewed quarterly.

### Principle 2: Region pinning is explicit

It is not enough that a vendor *"supports"* EU regions. Every vendor's
specific region is **explicitly configured**, **documented**, and
**verifiable** - via response trace headers, account settings
screenshots, vendor admin console confirmations, or both. The script
in this repo checks the configuration files; you check the admin
consoles.

Examples of explicit region pinning the script verifies:

- `vercel.json` includes `"regions": ["lhr1"]` (London) - pin the
  function execution region rather than relying on Vercel's default
  region selection.
- Sentry config files reference `*.de.sentry.io` (Frankfurt) - using
  the EU SaaS host, not the US default at `sentry.io`.
- Supabase project URL is present (the project region you confirm in
  the Supabase dashboard - the URL itself does not encode region).
- CSP `connect-src` includes `ingest.de.sentry.io` and does not include
  the US default `ingest.sentry.io`.

### Principle 3: Sub-processor disclosure

A live sub-processor list is published at a stable URL (e.g.
`/sub-processors` or `/data-processors`). The list is updated within
**7 days** of any change. Material changes - new sub-processor
processing identifying data, region change, regulator change - are
notified to subscribers and posted on the public page **30 days before
they take effect**.

### Principle 4: Quarterly verification

Every quarter, the operator runs `node verify-sovereignty.mjs` and
pastes the output into the quarterly access review record. Drift is
identified and a remediation timeline is set. The annual review (every
January) verifies each active sub-processor against the previous
year's attestation freshness, region pinning, and continued mission
alignment.

### Principle 5: Documented exceptions

Two areas are typically acceptable exceptions in practice:

- **Edge/CDN providers** (e.g. Cloudflare). Personal data is not
  persisted at the edge - only TLS metadata and WAF challenge events
  transit. Region-agnostic by nature; documented under the principle
  rather than replaced.
- **Payment processors with EU entities** (e.g. Stripe Payments Europe
  Ltd, Adyen). Operational data may transit to a US parent under SCCs
  for fraud-prevention, customer-support, and platform-engineering
  purposes. The data exposed is transactional metadata, not learner
  or customer content at scale. SOC 2 Type II attestation satisfies
  the exception threshold.

Document the exceptions in writing. Show them to institutional buyers
who ask. Do **not** weaponise sovereignty as a marketing wedge - it is
shown, not sold.

---

## Using the script

```bash
# Drop the script into your project
cp verify-sovereignty.mjs /path/to/your-project/scripts/

# Edit the SOVEREIGNTY_CONFIG block at the top of the script to match
# your stack (file paths, expected region, env var names)

# Run it from your project
node scripts/verify-sovereignty.mjs
```

By default the script treats the directory above its own as the project
root, which is right when it lives in `scripts/`. Set `SOVEREIGNTY_ROOT` to
check a project somewhere else without copying the script.

Exit code is `0` if every check passes and `1` otherwise, so you
can wire it into CI:

```yaml
# .github/workflows/sovereignty.yml
name: Sovereignty
on:
  pull_request:
  workflow_dispatch:
  schedule:
    - cron: '0 9 1 */3 *'   # quarterly: 09:00 on the 1st of every 3rd month
permissions:
  contents: read
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '24'
      - run: CI=1 node scripts/verify-sovereignty.mjs
```

CI mode (`CI=1`) skips checks that read `.env.local`, since that file is
expected to be absent on CI runners.

For machine-readable output (e.g. piping to a dashboard), set
`SOVEREIGNTY_JSON=1`. The human-readable lines come first, then a
`---JSON---` marker, then the JSON:

```bash
SOVEREIGNTY_JSON=1 node scripts/verify-sovereignty.mjs | sed '1,/^---JSON---$/d' > sovereignty.json
```

See [`examples/`](examples/) for the fixture project and the JSON output of
a fully-passing run against it.

---

## Reference implementation

See how TicketWave HQ applies these constraints to its own estate, exceptions included, at [ticketwavehq.com/sovereignty](https://ticketwavehq.com/sovereignty).

---

## What the script checks

| # | Check | Principle |
|---|-------|-----------|
| 1 | Vercel `vercel.json` pins `regions: ["lhr1"]` (or your chosen EU region) | 2 |
| 2 | All Sentry config files reference `*.de.sentry.io` | 2 |
| 3 | Supabase project URL is set (reminder to confirm region in dashboard) | 2 |
| 4 | Public sub-processor disclosure page mentions sovereignty posture | 3 |
| 5 | Privacy page is current - names current auth provider, no stale residue | 3 |
| 6 | `SECURITY.md` (vulnerability disclosure policy) present | 3 |
| 7 | GDPR Article 20: data portability endpoint exists | - |
| 8 | GDPR Article 17: account deletion endpoint exists | - |
| 9 | CSP `connect-src` targets Sentry EU host only | 2 |
| 10 | `X-Frame-Options: DENY` is set | - |

The Sentry check runs once per config file, so the default configuration
records 12 results from these 10 checks.

The script is intentionally focused on **infrastructure configuration**
that affects sovereignty, not the broader compliance posture (DPIAs,
DSAR logging, etc.). For the wider checklist see [`CHECKLIST.md`](CHECKLIST.md).

---

## Tailoring the script

The script's `SOVEREIGNTY_CONFIG` block at the top is intended to be
edited. Common adjustments:

- Change `vercelRegion` to your EU region (`lhr1` London, `fra1`
  Frankfurt, `dub1` Dublin, `cdg1` Paris, `arn1` Stockholm).
- Change `sentryEuHost` if you self-host Sentry in the EU.
- Change `supabaseExpectedRegion` to your project's region
  (`eu-west-2` London, `eu-central-1` Frankfurt, `eu-west-1` Ireland).
- Change `privacyMustMention` / `privacyMustNotMention` to flag any
  vendor you have migrated away from (e.g. ensure the privacy page no
  longer mentions a deprecated auth provider).
- Add new checks following the same pattern - each is a `try`/`catch`
  around a file read with a `record(...)` call.

---

## What this is not

- **Not legal advice.** Use this as engineering hygiene that supports
  legal compliance. Run material changes past counsel.
- **Not a competitive wedge.** Sovereignty is shown, not weaponised in
  marketing copy.
- **Not a perpetual escalation.** The principles set a default; new
  gaps are evaluated against the principles, not ratcheted further
  than the principles require.

---

## Related

- [TicketWaveHQ/eu-sovereign-stack](https://github.com/TicketWaveHQ/eu-sovereign-stack):
  the companion list of EEA/UK-hosted vendors, each with how to pin and verify
  its region. That list is the *what*; this checklist is the *how*.
- [TicketWaveHQ/uk-gdpr-dpa-templates](https://github.com/TicketWaveHQ/uk-gdpr-dpa-templates):
  DPA and sub-processor disclosure templates for the promises this checklist
  helps you keep.

---

## Maintainer

Maintained by **Jordan Gilbert** ([@eu-jordangilbert](https://github.com/eu-jordangilbert)),
the engineer who codified this checklist while running it quarterly on
production UK SaaS stacks. More at [veryseoly.com/jordan](https://veryseoly.com/jordan).
Published by [TicketWave HQ Ltd](https://ticketwavehq.com) ([@TicketWaveHQ](https://github.com/TicketWaveHQ)).

Tag [@eu-jordangilbert](https://github.com/eu-jordangilbert) on PRs and issues for review.
For security issues, see [`SECURITY.md`](SECURITY.md). For contribution
guidelines, see [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## License

[Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE).

You may copy, adapt, and use it commercially, provided you give
appropriate credit, link to the licence, and indicate if you made changes
(section 3(a) of the licence). A credit line that does all three:

> Adapted from the [EU/UK Sovereignty Checklist](https://github.com/TicketWaveHQ/eu-sovereignty-checklist)
> by Jordan Gilbert, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
> Changes: (say what you changed).
