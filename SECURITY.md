# Security policy

## Reporting a vulnerability

Please report privately via GitHub's **private vulnerability reporting**:
Security tab → *Report a vulnerability*. Please do not open a public issue
for a suspected vulnerability.

Include reproduction steps and the affected version/commit where possible.
The demo client is a read-only SPA; anything that only affects a locally
adjusted API base URL (a user setting) is lower severity than something that
affects the default deployment.

## Scope

This repo covers the read-only React demo client (bundled static files,
served by nginx). It handles no secrets and performs no writes — all auth and
data protection is enforced by the backend it calls.

## Dependencies

Third-party dependency alerts come via **Dependabot alerts**; proactive
weekly update PRs are configured in [`.github/dependabot.yml`](.github/dependabot.yml). Code scanning (CodeQL) runs on `main` and pull
requests.