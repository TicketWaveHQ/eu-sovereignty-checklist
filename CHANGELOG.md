# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing yet.

## [1.1.0] - 2026-11-10

### Added

- `CHECKLIST.md` section **1b, Self-hosted and dedicated infrastructure**
  (first published on `main` on 2026-09-16). The checklist assumed a
  managed-SaaS stack throughout: Vercel, a managed database, hosted error
  monitoring. Self-hosting on rented compute gives stronger sovereignty
  guarantees while moving the burden of proof onto the operator. The section
  covers what that burden is: physical location recorded rather than
  provider, signed DPAs held rather than merely available, the encryption
  boundary on backups crossing jurisdictions, restore tests with dates, and
  the distinction between software you run and a processor you send data to.
- `CHECKLIST.md` section **1c, AI and inference** (first published on `main`
  on 2026-09-16). Inference region is a separate claim from storage region,
  and the EU AI Act's Article 50 transparency obligations are treated as
  operational. Includes the provider versus deployer distinction, because
  integrating a foundation model does not automatically make you a GPAI
  provider.
- `SOVEREIGNTY_ROOT` environment variable: check a project in another
  directory without copying the script into its `scripts/` folder. The
  default (the directory above the script) is unchanged.
- `examples/passing-project/`: a minimal fixture the script passes against,
  so the example output can be reproduced and CI can test the script.
- README: a 60-second start, and a Related section linking the companion
  repositories.
- CI: a house-style job (no em-dashes) and a job that runs the script against
  the fixture (must pass) and an empty project (must fail). Every job can now
  be run by hand (`workflow_dispatch`).

### Changed

- Script output separates each check's name and detail with a colon
  (`name: detail`) instead of an em-dash. If you parse the text output,
  update the separator, or use `SOVEREIGNTY_JSON=1`.
- `examples/passing-run.json` is now the real output of a run against the
  fixture project. The previous file was not the script's output as
  printed: its key order differed.
- `SECURITY.md` follows TicketWave HQ's disclosure policy
  (<https://ticketwavehq.com/security>): reports go to `hello@ticketwavehq.com`
  with "security report" in the subject. The 3- and 10-working-day targets
  and the 90-day disclosure cadence are withdrawn, because the company does
  not publish response times it does not measure.
- Maintainer handle: `@eu-jordangilbert`. The `@sansware` link pointed at a
  GitHub organisation, so tagging it on a pull request reached nobody.
- CI: `actions/checkout@v7`; the link check moved from
  `gaurav-nelson/github-action-markdown-link-check` (archived) to
  `tcort/github-action-markdown-link-check@v1`, maintained by the authors of
  `markdown-link-check`.
- The README's CI recipe uses `actions/checkout@v7`, `actions/setup-node@v7`
  and `permissions: contents: read`.

### Fixed

- The link check failed on `https://ticketwavehq.com`, which answered the
  GitHub-hosted runner with `403` while answering a request from outside
  GitHub with `200`. The config now sends a descriptive User-Agent and treats `403` as
  alive, as `429` already was. Dead links (`404`, `410`, `5xx`, DNS) still fail.
- `examples/README.md` told you to run the script from the repository root,
  where it reads the parent directory and every check fails.
- `README.md` said attribution was optional. CC BY 4.0 requires it (credit, a
  link to the licence, and a note of any changes); the README now says so and
  gives a credit line that meets all three.
- `CHANGELOG.md` named the security contact that #3 replaced.

## [1.0.1] - 2026-06-28

### Added

- `SECURITY.md`: coordinated disclosure policy with 90-day cadence,
  routing to the maintainer's own security address (replaced in 1.1.0).
- `CODE_OF_CONDUCT.md`: Contributor Covenant 2.1.
- `CONTRIBUTING.md`: short contributor guide.
- `CHANGELOG.md`: this file.
- `.github/workflows/doc-lint.yml`: markdown link check on push, pull
  request and weekly.
- README: Maintainer section, shields.io badges, table of contents.

### Changed

- `LICENSE`: replaced summary prose with the canonical CC BY 4.0
  legalcode so GitHub recognises the licence as `CC-BY-4.0` rather than
  `NOASSERTION`.

## [1.0.0] - 2026-06-25

### Added

- Initial release.
- `verify-sovereignty.mjs`: the quarterly verification script (10 checks
  across Vercel region pinning, Sentry EU host, Supabase URL,
  sub-processor disclosure, privacy page, `SECURITY.md` presence, GDPR
  Articles 17 + 20 endpoints, CSP `connect-src`, and `X-Frame-Options`).
- `CHECKLIST.md`: the wider compliance checklist accompanying the
  script.
- `README.md`: methodology, the five principles, usage instructions,
  CI integration recipe.
- `examples/`: sample JSON and text output from a passing run.
- `LICENSE`: CC BY 4.0 (summary prose; replaced with legalcode in 1.0.1).

[Unreleased]: https://github.com/TicketWaveHQ/eu-sovereignty-checklist/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/TicketWaveHQ/eu-sovereignty-checklist/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/TicketWaveHQ/eu-sovereignty-checklist/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/TicketWaveHQ/eu-sovereignty-checklist/releases/tag/v1.0.0
