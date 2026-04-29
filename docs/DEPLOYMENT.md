# Deployment

Proposal Engine ships as a static SPA inside an Nginx container.
The image is built and pushed by Gitea CI on every commit to `master`.

## Pieces

| File                                   | Purpose                                                   |
| -------------------------------------- | --------------------------------------------------------- |
| `Dockerfile`                           | Multi-stage build (Node 22 → static dist served by Nginx) |
| `.gitea/workflows/build-and-push.yaml` | CI: install → check → build → docker push                 |
| `privateprompt-app.json`               | Manifest consumed by `app.privateprompt.tech`             |

## Local build

```bash
npm run build          # produces ./dist
docker build -t proposal-engine:dev .
docker run --rm -p 8080:80 proposal-engine:dev
# → http://localhost:8080
```

## Gitea CI

The workflow runs on push to `master`:

1. Checkout, install Node 22, `npm ci`.
2. `npm run check` (lint + tests + build).
3. Docker login to the Gitea registry using
   `${{ secrets.REGISTRY_TOKEN }}` for the `clovrlabs` namespace.
4. Build and push `gitea.apps.privateprompt.tech/clovrlabs/david-propsal-engine:latest`
   plus a tag with the short SHA.
5. The privateprompt orchestrator consumes the new image via the
   manifest below.

If you are bootstrapping a fork: copy `privateprompt-app.json` and
edit the `name`, `image` and `domain` fields.

## privateprompt manifest

`privateprompt-app.json` declares:

- `name` — slug for the app inside the orchestrator.
- `image` — fully qualified registry path.
- `domain` — public URL where the app is published.
- Resource limits and health-check path (`/`).

## Secrets

Gitea repository secrets required:

| Secret           | What it is                                                                    |
| ---------------- | ----------------------------------------------------------------------------- |
| `REGISTRY_TOKEN` | A Gitea personal access token with package write scope on the `clovrlabs` org |

Add them via Gitea Settings → Secrets. The SSH key used by maintainers
to push from local machines is unrelated to this CI flow.

## Rolling back

Roll back by retagging an earlier image:

```bash
docker pull gitea.apps.privateprompt.tech/clovrlabs/david-propsal-engine:<old-sha>
docker tag <old-sha> latest
docker push latest
```

…or by changing the manifest `image` to point at a previous SHA tag and
re-deploying via the privateprompt console. There's no in-app blue/green
rollout; each push replaces the container.

## Health & monitoring

- Endpoint: the SPA returns `index.html` at `/` and any sub-path
  (Nginx `try_files $uri /index.html;`).
- The privateprompt orchestrator does an HTTP 200 check on `/` every
  minute.
- Browser-side errors should be wired to whatever monitoring the team
  uses (none configured by default).

## Alternative hosts

The bundle is plain static HTML/JS/CSS. It runs on Netlify, Vercel,
Cloudflare Pages, S3 + CloudFront, or any HTTP server with SPA
fallback. The Dockerfile is the simplest path for the privateprompt
deploy target; use `npm run build && npm run preview` for ad-hoc
testing.
