# Phase 1 — Upstream Security Audit

**Subject:** `https://github.com/makeplane/plane`
**Commit audited:** `e056bbf9eb6b511cdc0a5823b1bd6922e561a485`
**Tag at HEAD:** `v1.4.2-rc1` · **Latest stable tag:** `v1.2.3` (2026-03-05)
**Date:** 2026-08-21 · **Method:** isolated read-only clone. No repo script was executed and no
project dependency was installed.

---

## Verdict: **GO-WITH-CONDITIONS**

The codebase is actively maintained, the build scripts are clean, and the one high-severity CVE
in scope is genuinely fixed at HEAD (verified by reading the code, not by trusting the changelog).
Nothing here is disqualifying. But four issues must be closed before this is exposed to anyone,
and one of them is a correctness landmine rather than a vulnerability.

### Top 3 conditions

1. **Pin every service to `v1.4.1`.** *(Investigated and resolved — see "The version trap" below.)*
   Do not build from HEAD. Mirror `backend`/`live`/`proxy` from the published
   `makeplane/plane-*:v1.4.1` images, and build `web`/`space`/`admin` from source at git tag
   **`v1.4.1-rc2`**. This satisfies the split-image rule with an explicit version tag and keeps
   all six services on one version.
2. **Neutralise all four phone-home call sites before first boot**, then confirm egress is closed.
   Telemetry is on by default and fires at container start.
3. **Patch Django 5.2.15 → 5.2.17** (4 known CVEs), patch the 3 HIGH JS advisories, and add a
   non-root `USER` to the three images we build ourselves.

---

## Findings

| # | Finding | Severity | Evidence (file:line) | Mitigation |
|---|---------|----------|----------------------|------------|
| 1 | Cloned HEAD is the tip of upstream's `preview` **development branch**, tagged `v1.4.2-rc1`. Building from it would ship a pre-release, and the naive split would pair it with a 1.2.3 backend | **High** | `git symbolic-ref origin/HEAD` → `origin/preview`; `git describe HEAD` → `v1.4.2-rc1`; newest stable git tag `v1.2.3` | **Resolved:** pin all six to `v1.4.1` — mirror the published `:v1.4.1` images, build frontends from git `v1.4.1-rc2` |
| 2 | Telemetry enabled by default, pushed on a Celery beat interval to a third-party collector | **High** | `license/models/instance.py:35` (`default=True`); `celery.py:51`; `utils/otlp_endpoints.py:19` (`https://telemetry.plane.so`) | Default to `False`; drop the beat entry; point `OTLP_ENDPOINT` at a local sink; verify with egress deny |
| 3 | Instance registration runs at every container start | **High** | `apps/api/bin/docker-entrypoint-api.sh:24` → `manage.py register_instance` | Remove the entrypoint line; it has no function on an internal-only deploy |
| 4 | Outbound version check to GitHub on every start | Medium | `license/management/commands/register_instance.py:43` → `api.github.com/repos/makeplane/plane/releases/latest` | Remove. Also an upstream-name leak (Phase 3) |
| 5 | Django 5.2.15 — 4 known CVEs | **High** | `pip-audit`: PYSEC-2026-2090, -2091, -2092, -3717 | Bump to **5.2.17** before build |
| 6 | 3 HIGH JS advisories in the lockfile | **High** | `trivy fs` on `pnpm-lock.yaml`: `brace-expansion@5.0.7` (CVE-2026-14257, -69152), `nanoid@3.3.8` (CVE-2026-67213, -67214), `react-router@7.18.1` (GHSA-qwww-vcr4-c8h2) | `pnpm.overrides` → 5.0.8 / 3.3.18 / 7.18.2; refresh lockfile pre-build |
| 7 | Every production container runs as root | **High** | No `USER` directive in any of the 6 production Dockerfiles; `trivy` DS-0002 ×12 | Add non-root `USER` to the 3 images we build; set a non-root security context for mirrored images |
| 8 | Real Django `SECRET_KEY`s committed in history | Medium | `gitleaks` over **6,593 commits** → 7 hits, e.g. `deploy/selfhost/variables.env` (2023-10-23), `ENV_SETUP.md` (2024-07-09) contained live 50-char keys | **Structurally eliminated**: Rule 3 discards `.git`. Verified HEAD is clean — surviving hits are the literal placeholder `change-this-key-on-deployment`; `trivy` secret scan on HEAD = **0** |
| 9 | Default credentials in env templates | Medium | `.env.example:3` `POSTGRES_PASSWORD="plane"`; `:15` `RABBITMQ_PASSWORD="plane"` | Never copy the templates. Generate every credential as an N0 app secret |
| 10 | Unpinned `tonistiigi/binfmt` (implicit `:latest`), a privileged binfmt-registering image | Medium | `deployments/aio/community/Dockerfile:2`; `trivy` DS-0001 | We do not use the all-in-one image. Delete `deployments/aio/` in Phase 2 |
| 11 | Upstream `.trivyignore` suppresses an SSRF CVE | Low (verified) | `.trivyignore` suppresses **CVE-2026-30242** (CVSS 8.5, SSRF, CWE-918) | **Verified legitimate — patched at HEAD.** See below. Do not inherit blindly: annotate with a review date |
| 12 | `RUN apk update` as a standalone layer | Low | `apps/live/Dockerfile.live`; `trivy` DS-0017 ×2 | Stale-cache risk. Combine update+add in our build layer |
| 13 | Build scripts are clean — no curl-pipe-bash, no external binary pulls | **Pass** | `setup.sh` reviewed in full; `SECRET_KEY` from `/dev/urandom:65`; sole lifecycle hook is root `prepare: husky` | Still build CI with `--ignore-scripts` |

### On finding 11 — I verified this rather than trusting it

Upstream suppresses CVE-2026-30242 in `.trivyignore` with a self-authored "false positive"
rationale. A vendor suppressing their own SSRF CVE deserves scrutiny, so I read the code.
The fix is real and thorough. `plane/utils/ip_address.py` resolves the hostname via
`getaddrinfo` and checks **every** returned address against `is_private`, `is_loopback`,
`is_reserved`, `is_link_local` and `is_multicast`, explicitly closes the `100.64.0.0/10`
CGNAT gap that the stdlib flags miss, restricts the scheme to http/https, and defaults both
allowlists to empty. `169.254.169.254` — the cloud-metadata target — is blocked by the
link-local check.

The advisory says fixed in 1.2.3; HEAD is 1.4.2-rc1. The suppression is accurate **at this
commit**. The residual risk is procedural: a blanket ID suppression will also hide a *future*
regression under the same ID.

---

## Project health

| Signal | Reading |
|---|---|
| Last commit | 2026-08-16 (5 days before audit) |
| Commits, 90 / 365 days | 96 / 915 |
| Contributors, 180 days | 6 named + dependabot |
| Release cadence | 4–8 weeks through v1.2.3, then **RC-only for 1.3.x and 1.4.x** |
| Bus factor | **Concentrated** — one maintainer authored ~49% of 180-day commits |
| Security policy | Present (`SECURITY.md`, security@plane.so), with a documented disclosure process |
| Dependency hygiene | dependabot active; Python deps pinned; pnpm lockfile committed |

The RC-only stretch since March is the signal that matters. Either the project has changed its
tagging practice, or 1.3/1.4 never stabilised. Both readings argue for pinning deliberately
rather than tracking HEAD.

## Scanner coverage — and its limits

| Tool | Scope | Result |
|---|---|---|
| `gitleaks` 8.21.2 | Full history, 6,593 commits | 7 findings (all historical or placeholder) |
| `trivy fs` 0.74.0 | vuln + secret + misconfig, 13 targets | 5 HIGH vulns, 15 misconfigs, **0 secrets** |
| `pip-audit` | `apps/api/requirements/production.txt` | 4 CVEs in 1 package (Django) |

**Gap, stated plainly:** trivy parsed `pnpm-lock.yaml` but not the Python requirements, so the
Python result is pip-audit's alone and is not corroborated by a second tool. `npm audit` was not
run — it needs a resolved `node_modules`, and installing dependencies is out of scope for this
phase. Trivy's lockfile analysis covers the same ground without executing anything.

---

## What Phase 3 inherits from this audit

Findings 2, 3 and 4 are the de-brand phase's telemetry checklist. Concretely:
`license/models/instance.py:35`, `celery.py:51`, `utils/otlp_endpoints.py:19`,
`bin/docker-entrypoint-api.sh:24`, `license/management/commands/register_instance.py:43`.
All five must be dead before the first boot, and the deployment should be egress-denied so a
missed call site fails loudly instead of silently phoning home.


---

## The version trap, and how it resolves

The brief's split-image rule looked like it forced a bad trade. The git repo's newest *stable*
tag is `v1.2.3` (March), while the clone's HEAD is `v1.4.2-rc1`. Mirroring "a pinned stable tag"
for the backend while building frontends from source would have paired a 1.4.2-rc1 frontend
against a 1.2.3 backend — 188 commits and two minor versions apart.

Checking the registry instead of assuming resolved it. **All six services publish a stable
`v1.4.1` image tag**, even though no `v1.4.1` git tag exists — upstream tags images on release
but only `-rc` tags in git. So the pinning target is `v1.4.1`, and Rule 5 holds intact.

For the three images built from source, the matching source point is **`v1.4.1-rc2`**, whose
`package.json` reads `1.4.1`. Two checks confirm it is safe to pair with the `v1.4.1` runtime
images:

| Check | Result |
|---|---|
| Commits `v1.4.1-rc2..HEAD` | 2 |
| Changes to serializers / URL routing / migrations in that range | **none** |
| New DB migrations after `v1.4.1-rc2` | **none** |

No API-contract or schema drift. Residual risk: `v1.4.1-rc2` is not provably the exact commit
that produced the published `v1.4.1` images — upstream may have cut the release from an
untagged commit (one exists, `ed61f992`, dated 2026-08-04, carrying version `1.4.1`). The
mitigation is a Phase 5 smoke test of the frontend against the mirrored backend, which is
already required.

### Also confirmed for later phases

- **Gitea Actions works on this instance.** No runner is registered at repo or org scope, but
  sibling repos have real run histories (`lunarpad` 15, `keyside` 9), so a shared instance-level
  runner is servicing the org. Phase 4 CI is viable. Instance-level runner listing needs
  `read:admin`, which the minted token lacks, so this is inferred from run history rather than
  read directly.
- **`lunarrails/Switchyard` was created public.** Corrected to private via API — an internal-only
  deployment must not have a world-readable source repo. Default branch `main`, currently empty.
- **Docker image names must be lowercase.** The repo is `Switchyard`, but registry paths must be
  `lunarrails/switchyard-*`. Registry rejects uppercase in repository names.
