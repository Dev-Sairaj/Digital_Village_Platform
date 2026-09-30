# Contributing / Project Rules

Single source of truth for stack, structure, setup, workflow, environments, CI/CD, and architecture conventions. If it's not here or in an actual config file (`eslint.config.js`, `.prettierrc`, `tsconfig.json`), it isn't a rule. Raise it in a PR to add it here first.

## Stack

| Tool       | Version / Choice                      |
| ---------- | ------------------------------------- |
| Node.js    | 24.x (`nvm install 24 && nvm use 24`) |
| npm        | 11.x (`npm install -g npm@11`)        |
| Framework  | React 19 + TypeScript (Vite)          |
| Routing    | react-router-dom                      |
| HTTP       | axios                                 |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS custom properties |
| Linting    | ESLint 9 (flat config) + Prettier     |
| Deployment | Vercel (lead-controlled environments) |
| CI         | GitHub Actions                        |

## Folder Structure

```text
src/
├── api/
│ ├── apiClient.ts # axios instance, interceptors (auth token, org header, 401 handling)
│ ├── apiUrl.ts # centralized endpoint map, keyed by feature
│ ├── repositories/ # raw API calls only (one file per feature)
│ └── services/ # business logic + toast feedback, calls repositories
├── components/
│ ├── layout/ # MainLayout, Sidebar, ProfileMenu
│ ├── skeleton/ # loading-state components per page
│ └── ui/ # shared/reusable UI primitives (shadcn-style)
├── data/ # static local data (e.g. holidays.ts)
├── hooks/ # custom hooks
├── lib/ # utils.ts (cn helper), theme.ts (design tokens mirror)
├── pages/ # one file per route
├── styles/ # theme.css (CSS custom properties)
├── types/ # shared TypeScript types & interfaces
├── App.tsx # routes + ProtectedRoute wrapper
├── main.tsx # ReactDOM root
└── index.css # imports theme.css, Tailwind directives
```

## Setup (every developer, once)

```bash
nvm install 24 && nvm use 24
npm install -g npm@11

git clone <repo-url>
cd digital-village-platform-web
cp .env.example .env      # Windows PowerShell: copy .env.example .env
# fill in real values (ask the lead)
npm install
npm run dev
```

`.npmrc` (committed) contains `legacy-peer-deps=true` so that `npm install` and CI's `npm ci` resolve peer dependencies the same way. Do not remove it.

### npm scripts

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the local dev server                    |
| `npm run lint`         | ESLint, including the architecture rules      |
| `npm run typecheck`    | `tsc --noEmit`                                |
| `npm run build`        | Type-check and production build               |
| `npm run format`       | Format the code with Prettier                 |
| `npm run format:check` | Check formatting without changing files       |
| `npm run preview`      | Serve the production build locally            |

## Developer Workflow

### Before `git push`

1. **Branch from a fresh `develop`.** Never work directly on `main` or `develop`.
   ```bash
   git checkout develop && git pull
   git checkout -b feat/short-description
   ```
   Prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`.
2. **Code within the [Architecture Rules](#architecture-rules-enforced-by-eslint)**, [TypeScript](#typescript), and [Imports](#imports) sections below.
3. **Run the same checks CI runs.** All three must pass:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
4. **Review your diff.** Run `git status` and `git diff`. No `.env` files, secrets, debug code, or unrelated changes.
5. **Commit** with a [conventional message](#commits--prs), e.g. `git commit -m "feat: add village directory page"`.
6. **Push.**
   ```bash
   git push -u origin feat/short-description
   ```

Before-push checklist:

- [ ] Branched from an up-to-date `develop`
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` all pass
- [ ] No `.env` files or secrets in the diff
- [ ] New env variable? Name added to `.env.example` and the lead informed
- [ ] Conventional commit message

### After `git push`

1. **Open a PR into `develop`.** Add a short summary (what and why).
2. **Watch CI** in the PR's **Checks** tab (`build-and-check`). If red, open the failed step, fix locally, re-run the before-push checks, and push again. CI reruns automatically. A red check blocks the merge.
3. **Open the Vercel preview URL** the bot comments on the PR. Click through your change, and refresh on a deep link to confirm routing works. Paste the URL into the PR description.
4. **Get at least 1 approval.** Address comments by pushing more commits to the same branch.
5. **Merge into `develop`** once the check is green, the PR is approved, and the branch is up to date.
6. **Development deploy.** Merging starts `deploy-development`, which pauses until the lead approves (**Actions → the run → Review deployments**). Ping the lead if it is waiting.
7. **Verify** the change on the Development URL, then delete your branch.
   ```bash
   git checkout develop && git pull
   git branch -d feat/short-description
   ```
8. **Production** is released by the lead only, by merging `develop` into `main`. It needs the lead's approval to deploy.

After-push checklist:

- [ ] PR opened against `develop`
- [ ] CI green
- [ ] Preview URL checked and added to the PR description
- [ ] At least 1 approval, then merged
- [ ] Lead approved the development deploy
- [ ] Verified on the Development URL, branch deleted

### When CI fails

| Symptom                                  | Likely fix                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| `boundaries/element-types`               | You imported across layers. Go through a service.                                       |
| `import/order`                           | Reorder imports as described in [Imports](#imports).                                    |
| `tsc` errors                             | Fix the types. Don't add `any` to silence them.                                         |
| `npm ci` says lockfile out of sync       | Run `npm install` locally and commit the updated `package-lock.json`.                   |
| `ERESOLVE` on install                    | Confirm `.npmrc` with `legacy-peer-deps=true` is committed.                             |
| Build passes locally, fails in CI        | Missing env variable or uncommitted file. Compare `.env.example` with Vercel/GitHub settings; run `git status`. |
| Preview shows 404 on refresh             | `vercel.json` must rewrite all routes to `/`.                                           |

## Environment Variables

Vite loads env files by mode. Only `.env.example` is committed. `.env` and `.env.test` are git-ignored.

| File         | Committed? | Loaded when                           | Purpose                                                            |
| ------------ | ---------- | ------------------------------------- | ------------------------------------------------------------------ |
| .env.example | Yes        | Never loaded directly                 | Template listing every key, no real values                         |
| .env         | No         | Always (dev/local + production build) | Real values for whichever environment you're running               |
| .env.test    | No         | `vite --mode test` / CI test runs     | Values for automated tests (mocked API base URL, dummy keys, etc.) |

```env
# .env.example

VITE_API_BASE_URL=
VITE_APP_ORG_HEADER=
```

Real per-environment values live only in Vercel's project settings (marked Sensitive) and, for CI, in GitHub Actions secrets. Anything prefixed `VITE_` is bundled into the browser, so it must be genuinely public. Never put a secret in a `VITE_` variable.

If a test job is added, it writes `.env.test` from GitHub Actions secrets at the start of the job, so Vite picks it up via `vite --mode test`, and it runs before `build-and-check`.

## Vercel Environments

| Environment | Branch trigger        | Purpose             | Who deploys       |
| ----------- | --------------------- | ------------------- | ----------------- |
| Development | develop / feature PRs | Integration testing | Auto, lead-gated  |
| Preview     | any PR branch         | Per-PR review link  | Auto on PR        |
| Production  | main                  | Live release        | Manual, lead only |

The Development and Production Vercel environments are configured as protected GitHub Environments requiring the lead's approval before a deployment job runs.

`vercel.json` (SPA rewrite so React Router deep links work):

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

## GitHub Actions: CI Gate

`.github/workflows/ci.yml` runs on every PR and must pass before merge:

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  build-and-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build

  deploy-development:
    needs: build-and-check
    if: github.ref == 'refs/heads/develop' && github.event_name == 'push'
    runs-on: ubuntu-latest
    environment:
      name: development # requires lead approval (Settings > Environments > development > Required reviewers)
    env:
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm i -g vercel@latest
      - run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

Use one deploy path only. Because deployments are lead-gated through GitHub Environments, disable Vercel's own Git auto-deploy for gated branches, otherwise the app deploys twice and bypasses the approval.

### Lead's one-time setup

- **GitHub → Settings → Environments:** create `development` and `production`, and add the lead as **Required reviewer** on both.
- **GitHub → Settings → Secrets and variables → Actions:** add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- **GitHub → Settings → Branches:** protect `main` and `develop`. Require the `build-and-check` status check, at least one approving review, and up-to-date branches before merge.
- **Vercel → Project Settings → Environment Variables:** set `VITE_API_BASE_URL` and `VITE_APP_ORG_HEADER` separately for Development, Preview, and Production.
- Keep the [Vercel Environments](#vercel-environments) table above in sync with the real Vercel settings.

## Architecture Rules (enforced by ESLint)

- pages/components → services → repositories → apiClient
- `api/repositories/`: raw API calls only. One file per feature. No business logic, no toasts, no state, no imports from `services/`.
- `api/services/`: business logic + user feedback (toasts/errors). Calls `repositories/`, never `apiClient` directly. The only `api/` layer pages/components may import from.
- `pages/` / `components/`: may import `services/`, `hooks/`, `lib/`, `components/ui/`. May not import `api/repositories/` directly.
- `components/ui/`: dumb, reusable primitives only (Button, Input, Card). No feature-specific logic, no API imports.
- Endpoints are defined in `api/apiUrl.ts`, keyed by feature.

This is enforced by the `boundaries/element-types` rule in `eslint.config.js`. A PR that violates it fails `npm run lint` and therefore fails CI, not just code review.

## TypeScript

- `strict: true` in `tsconfig.json`, no per-file opt-outs.
- `any` disallowed except at typed I/O boundaries, with a comment explaining why.
- Every shared shape (API DTOs, domain models) gets an explicit type in `src/types/`.

## Imports

Order (enforced by eslint-plugin-import's `order` rule): external packages → `@/api/*` → `@/components/*` → `@/hooks/*` → `@/lib/*` → relative imports.

## Authentication & Routing

- `App.tsx` defines all routes and wraps protected ones in `<ProtectedRoute>`, which checks auth state before rendering. Unauthenticated users redirect to `/login`.
- `apiClient.ts` centralizes the axios instance: attaches auth token + org header on every request, and on 401 clears the session and redirects to `/login`.
- No page/component reads `localStorage`/tokens directly. Always go through services/hooks.

## Commits / PRs

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- PR must pass CI (lint + typecheck + build) before requesting review.
- PR description includes the preview URL once Vercel posts it.
- One feature or fix per PR. Keep PRs small.
- Explain any new dependency in the PR description.
- Never push directly to `main` or `develop`. Never merge with a red check or bypass branch protection. Never commit secrets or `.env` files.

## Required Evidence per Milestone

For the "web shell + pipeline" milestone, attach in the PR description:

- [ ] Preview URL from the Vercel bot comment.
- [ ] Link to the passing GitHub Actions run, including the approved development deploy.
- [ ] The environment matrix table above, confirmed against actual Vercel project settings.