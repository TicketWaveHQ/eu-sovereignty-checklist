# EU/UK Sovereignty Checklist

A markdown checklist for teams who do not want to run a script — work
through it quarterly and tick the boxes.

For the automated version, see `verify-sovereignty.mjs` in this repo.
The two are complements: the script covers what can be verified
mechanically from your repo; the checklist covers the rest (admin
console settings, vendor attestations, signed DPAs).

---

## 0. Quarterly setup

- [ ] Schedule a recurring calendar event (every 3 months) titled
      "Sovereignty verification + access review"
- [ ] Open your previous quarter's verification record for diff reference
- [ ] Create a new record file (e.g. `operations/access-reviews/{YYYY}-Q{n}.md`)

---

## 1. Hosting region pinning

### Vercel

- [ ] `vercel.json` includes `"regions": ["lhr1"]` (or your chosen EU region)
- [ ] `curl -sI https://your-domain.example` returns `x-vercel-id`
      header reflecting the pinned region (look for the region code in
      the third segment, e.g. `lhr1::...`)
- [ ] Production deployment summary in the Vercel dashboard shows the
      expected region

### Supabase (or your managed database)

- [ ] Project region (in dashboard → Project Settings → General) matches
      your declared region (e.g. London `eu-west-2`, Frankfurt
      `eu-central-1`, Ireland `eu-west-1`)
- [ ] Read replicas (if any) are also in EEA/UK regions
- [ ] Point-in-time recovery backups land in the same region (Supabase →
      Database → Backups; confirm storage region)

### Sentry (or your error monitoring)

- [ ] DSN points at `*.de.sentry.io` (or your chosen EU host)
- [ ] All Sentry config files in your repo (`sentry.client.config.js`,
      `sentry.server.config.js`, `sentry.edge.config.js`) include a
      runtime warning if the DSN host is not the EU host
- [ ] CSP `connect-src` includes `ingest.de.sentry.io` and does **not**
      include the US default `ingest.sentry.io`

### Email (transactional)

- [ ] Provider (Resend, Postmark, SendGrid, Mailgun) confirms EU region
      pinning in the admin console
- [ ] Sending domain DKIM and SPF records confirm the EU sending region
- [ ] Webhook endpoints terminate at your EU-hosted application

### Email (newsletter / marketing)

- [ ] Provider (MailerLite, Brevo, Smaily, GetResponse) is an EU entity
      or has explicitly pinned EU data residency
- [ ] Subscriber list export tested at least once a year (ensures you
      can leave the provider if region changes)

### Analytics

- [ ] Provider is EU-resident (Plausible Germany, Fathom self-hosted,
      Matomo Cloud EU, Simple Analytics)
- [ ] If using a US provider with EU sub-processing (e.g. PostHog EU
      Cloud), confirm `host: https://eu.posthog.com` configured in code

---

## 1b. Self-hosted and dedicated infrastructure

Skip this section if everything you run is managed SaaS. Include it if any part
of your stack is software you administer on rented compute — that pattern gives
you stronger sovereignty guarantees than a managed platform, but the burden of
proving them moves to you.

- [ ] **Every server's physical location is recorded**, not just its provider.
      "Hetzner" is not a region; Helsinki and Falkenstein are. A provider with
      EEA headquarters can still place your workload outside the EEA
- [ ] **The provider's data processing agreement is signed and held**, not
      merely available. Note the date and where the countersigned copy lives
- [ ] **Backups are encrypted before leaving the host.** If the backup target is
      a different provider or a different jurisdiction, the encryption boundary
      is what makes that acceptable — the provider holds ciphertext it cannot
      read. Record who holds the key
- [ ] **The backup provider's region is pinned and recorded separately** from
      the compute region. These drift independently
- [ ] **Restores are tested, with the date of the last successful test.** An
      untested backup is a claim, not a control
- [ ] **Self-hosted application software is listed as software, not as a
      processor.** If you run it yourself, the vendor receives nothing in normal
      operation and is not an Article 28 sub-processor — say so explicitly
      rather than omitting them, because omission reads as an oversight
- [ ] **Administrative access paths are documented**: who can reach the host,
      by what mechanism, and what happens when that person is unavailable
- [ ] **Outbound mail from the host has a named provider and region.** Servers
      that send email quietly acquire a sub-processor

## 1c. AI and inference

Required if any model touches personal data, and increasingly asked for even
where it does not.

- [ ] **Inference region is recorded, not just storage region.** EU data
      residency and EU processing are different claims. A model hosted outside
      the EEA processes the prompt wherever it runs, whatever the database does
- [ ] **Model provider retention and training terms are recorded** per model:
      what is retained, for how long, and whether inputs may train the model.
      Zero-retention mitigates retention, not location
- [ ] **Each model has a review or sunset date.** Providers deprecate versions
      and change terms; an unreviewed model is an unreviewed transfer
- [ ] **Provider or deployer role assessed explicitly.** Integrating a
      third-party foundation model does not automatically make you a GPAI
      provider under the EU AI Act — assess your actual role and any
      modifications, and record the conclusion
- [ ] **Article 50 transparency.** Where users interact with an AI system,
      disclosure is designed in. Where content is AI-generated or manipulated,
      marking is supported. Treat these as operational rather than forthcoming
- [ ] **Automated decisions documented** as solely or partly automated, with
      human review that can in practice reach a different outcome. A reviewer
      who cannot change the answer is not oversight
- [ ] **High-impact uses flagged for separate review** — employment, biometric
      or surveillance, tenant screening, credit. These carry obligations beyond
      data residency and should not be quietly inside a general AI section

## 2. Authentication

- [ ] Auth provider is EU-resident (Supabase Auth EU project, Clerk EU
      region, Keycloak self-hosted EU, Stytch EU instance)
- [ ] Privacy policy names the current auth provider
- [ ] Privacy policy contains **no residual references** to a
      previous/migrated auth provider
- [ ] User session cookies are first-party (`Domain=your-domain.example`)
      and not loaded from a third-party JS bundle that could carry a
      tracking pixel

---

## 3. Edge / CDN

- [ ] Cloudflare (or your CDN) does not persist personal data at edge —
      only TLS termination, WAF, DDoS, caching
- [ ] No edge functions / Cloudflare Workers persist personal data in
      Workers KV, R2, D1, or Durable Objects without an EU-pinned
      namespace
- [ ] Cloudflare Bot Management / Turnstile (if used) does not log
      identifying PII; confirm in the audit console

---

## 4. Payments

- [ ] Payment processor's EU entity is the contracted counterparty
      (Stripe Payments Europe Ltd, Adyen N.V., etc.)
- [ ] Transfer to a US parent entity is governed by SCCs (UK
      Addendum to EU SCCs, or UK IDTA) — confirm in the DPA
- [ ] Payment confirmation emails do not include card BIN ranges or
      raw card data in the body

---

## 5. Sub-processor disclosure

- [ ] Public page at a stable URL (e.g. `/sub-processors`,
      `/data-processors`) listing every active sub-processor
- [ ] Each entry includes: vendor name, purpose, processing region,
      data tier, transfer mechanism (if any)
- [ ] Page mentions "EEA/UK-sovereign" or "Data Sovereignty" so
      readers can find the posture
- [ ] List updated within **7 days** of any sub-processor change
- [ ] Material changes (new sub-processor processing identifying data,
      region change, regulator change) notified to subscribers
      **30 days before** they take effect
- [ ] Newsletter sign-up flow includes a link to the disclosure page in
      the consent text

---

## 6. Data subject rights

- [ ] GDPR Article 15 / 20 — data access / portability endpoint exists
      and returns a complete export (test it yourself once a year)
- [ ] GDPR Article 17 — account deletion endpoint exists and actually
      deletes all PII (test it yourself with a fresh test account)
- [ ] DSAR log records every Article 15-22 request with timestamp,
      identifier, and outcome
- [ ] Privacy contact email (`privacy@your-domain.example`) is staffed
      and tested quarterly with a synthetic DSAR

---

## 7. Security posture

- [ ] `SECURITY.md` (vulnerability disclosure policy) present at repo
      root and at `/.well-known/security.txt`
- [ ] `X-Frame-Options: DENY` set (matches CSP `frame-ancestors 'none'`)
- [ ] `Strict-Transport-Security` header with `max-age >= 31536000`,
      `includeSubDomains`, `preload`
- [ ] `Content-Security-Policy` with `connect-src` audit confirming no
      US telemetry hosts present
- [ ] Admin actions write to an `audit_log` table; verify at least one
      destructive admin handler in code calls the audit helper

---

## 8. Vendor evidence

For every active sub-processor:

- [ ] DPA on file, signed by both parties
- [ ] Most recent SOC 2 Type II (or equivalent) attestation reviewed
      within the last 12 months
- [ ] EU representative published if vendor is non-EU
- [ ] Vendor's own sub-processor list reviewed for unexpected
      US-onward-transfer surprises

---

## 9. Documented exceptions

- [ ] Each exception (typically: edge/CDN provider, payment processor's
      US parent) listed on the public disclosure page with a written
      justification under Principle 3 of your sovereignty posture
- [ ] Exceptions reviewed annually (every January) against the
      principles — are they still the only option?

---

## 10. Sign-off

- [ ] All checks above completed
- [ ] Any failures logged with a remediation timeline
- [ ] Quarterly access review record committed to repo (or
      Confluence / Notion equivalent)
- [ ] Operator + accountable trustee/director sign off in the record

---

## License

CC BY 4.0 — see [LICENSE](LICENSE).
