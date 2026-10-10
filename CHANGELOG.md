# Changelog

## 2026-09-16

Added two sections.

**1b — Self-hosted and dedicated infrastructure.** The checklist assumed a
managed-SaaS stack throughout: Vercel, a managed database, hosted error
monitoring. That pattern is common but it is not the only one, and self-hosting
on rented compute gives stronger sovereignty guarantees while moving the burden
of proof onto the operator. The new section covers what that burden actually is
— physical location recorded rather than provider, signed DPAs held rather than
merely available, the encryption boundary on backups crossing jurisdictions,
restore tests with dates, and the distinction between software you run and a
processor you send data to.

**1c — AI and inference.** The checklist had nothing on AI at all, which is no
longer tenable in an EU sovereignty document. Inference region is a separate
claim from storage region, and the EU AI Act's Article 50 transparency
obligations are operational rather than forthcoming. Includes the provider
versus deployer distinction, because integrating a foundation model does not
automatically make you a GPAI provider, and most teams assume one answer without
checking which applies.


All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SECURITY.md` — coordinated disclosure policy with 90-day cadence,
  routing to `security@brothersylvester.com`.
- `CODE_OF_CONDUCT.md` — Contributor Covenant 2.1.
- `CONTRIBUTING.md` — short contributor guide.
- `CHANGELOG.md` — this file.
- README: Maintainer section, shields.io badges, table of contents.

### Changed

- `LICENSE` — replaced summary prose with the canonical CC BY 4.0
  legalcode so GitHub recognises the licence as `CC-BY-4.0` rather than
  `NOASSERTION`.

## [1.0.0] — 2026-06-25

### Added

- Initial release.
- `verify-sovereignty.mjs` — the quarterly verification script (10 checks
  across Vercel region pinning, Sentry EU host, Supabase URL,
  sub-processor disclosure, privacy page, `SECURITY.md` presence, GDPR
  Articles 17 + 20 endpoints, CSP `connect-src`, and `X-Frame-Options`).
- `CHECKLIST.md` — the wider compliance checklist accompanying the
  script.
- `README.md` — methodology, the five principles, usage instructions,
  CI integration recipe.
- `examples/` — sample JSON and text output from a passing run.
- `LICENSE` — CC BY 4.0 (summary prose; replaced with legalcode in the
  unreleased entry above).

[Unreleased]: https://github.com/TicketWaveHQ/eu-sovereignty-checklist/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/TicketWaveHQ/eu-sovereignty-checklist/releases/tag/v1.0.0
