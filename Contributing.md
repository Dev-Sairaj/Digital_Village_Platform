# Contributing / Project Rules

Single source of truth for stack, structure, setup, workflow, environments, CI/CD, and architecture conventions. If it's not here or in an actual config file (`eslint.config.mjs`, `.prettierrc`, `tsconfig.json`, `next.config.ts`), it isn't a rule. Raise it in a PR to add it here first.

## Stack

| Tool       | Version / Choice                                                 |
| ---------- | ---------------------------------------------------------------- |
| Node.js    | 24.x (`nvm install 24 && nvm use 24`)                            |
| npm        | 11.x (`npm install -g npm@11`)                                   |
| Framework  | Next.js 16 (App Router) + React 19 + TypeScript                  |
| Routing    | Next.js file-based routing (`src/app`), no react-router          |
| HTTP       | axios                                                            |
| Styling    | Tailwind CSS v4 (`@tailwindcss/postcss`) + CSS custom properties |
| Linting    | ESLint 9 CLI (flat config, `eslint-config-next`) + Prettier      |
| Deployment | Vercel (lead-controlled environments)                            |
| CI         | GitHub Actions                                                   |

Notes specific to Next.js 16:

- `next lint` no longer exists. Linting is `eslint .` (see `package.json`).
- `middleware.ts` is replaced by `proxy.ts`. We use `src/proxy.ts`.
- `params`, `searchParams`, `cookies()` and `headers()` are async. Always `await` them.

## Folder Structure

```text
src/
├── app/                              # routing only (App Router)
│ ├── layout.tsx                      # root layout (html, body, providers)
│ ├── globals.css                     # imports theme.css + Tailwind
│ ├── not-found.tsx
│ ├── error.tsx                       # global error boundary ("use client")
│ ├── (auth)/
│ │ └── login/page.tsx                # public routes
│ ├── (dashboard)/                    # protected routes (route group, not in URL)
│ │ ├── layout.tsx                    # MainLayout: sidebar, profile menu
│ │ ├── page.tsx                      # "/"
│ │ ├── loading.tsx                   # skeleton while a page loads
│ │ └── <feature>/page.tsx            # one folder per route
│ └── api/                            # Route Handlers (only when truly needed)
├── api/
│ ├── apiClient.ts                    # axios instance, interceptors (auth token, org header, 401 handling)
│ ├── apiUrl.ts                       # centralized endpoint map, keyed by feature
│ ├── repositories/                   # raw API calls only (one file per feature)
│ └── services/                       # business logic + error normalization, calls repositories
├── components/
│ ├── layout/                         # MainLayout, Sidebar, ProfileMenu
│ ├── skeleton/                       # loading-state components per page
│ ├── features/<feature>/             # feature-specific components used by app/<feature>/page.tsx
│ └── ui/                             # shared/reusable UI primitives (shadcn-style)
├── data/                             # static local data (e.g. holidays.ts)
├── hooks/                            # custom hooks (client-side)
├── lib/                              # utils.ts (cn helper), theme.ts (tokens mirror), session.ts (token access)
├── styles/                           # theme.css (CSS custom properties)
├── types/                            # shared TypeScript types & interfaces
└── proxy.ts                          # request interception: redirect unauthenticated users to /login
public/                               # static assets
next.config.ts
postcss.config.mjs
eslint.config.mjs
```

What changed from the Vite layout:

| Before (Vite)            | Now (Next.js)                                         |
| ------------------------ | ----------------------------------------------------- |
| `src/pages/`             | `src/app/**/page.tsx` (thin) + `components/features/` |
| `App.tsx` routes         | folders under `src/app`, grouped by route groups      |
| `main.tsx`, `index.html` | `src/app/layout.tsx`                                  |
| `ProtectedRoute`         | `(dashboard)/layout.tsx` + `src/proxy.ts`             |
| `VITE_*` env variables   | `NEXT_PUBLIC_*` env variables                         |
| `vite.config.ts`         | `next.config.ts`                                      |
| `vercel.json` rewrites   | not needed (Vercel detects Next.js)                   |

## Setup (every developer, once)

```bash
nvm install 24 && nvm use 24
npm install -g npm@11

git clone <repo-url>
cd digital-village-platform-web
cp .env.example .env.local      # Windows PowerShell: copy .env.example .env.local
# fill in real values (ask the lead)
npm install
npm run dev
```

App runs at `http://localhost:3000`.

### npm scripts

| Command                | What it does                             |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the Next.js dev server             |
| `npm run lint`         | ESLint, including the architecture rules |
| `npm run typecheck`    | `tsc --noEmit`                           |
| `npm run build`        | Production build (`next build`)          |
| `npm run start`        | Serve the production build locally       |
| `npm run format`       | Format the code with Prettier            |
| `npm run format:check` | Check formatting without changing files  |

## One-Time Migration from Vite (lead, once)

Only needed on the existing repo. New clones skip this.

```bash
# 1. Remove Vite and the old router
npm uninstall vite @vitejs/plugin-react @tailwindcss/vite react-router-dom \
  eslint-plugin-boundaries eslint-plugin-react-hooks eslint-plugin-import typescript-eslint @eslint/js

# 2. Add Next.js
npm install next@latest react@latest react-dom@latest
npm install -D @tailwindcss/postcss eslint-config-next

# 3. Delete Vite files
#    index.html, vite.config.ts, src/main.tsx, src/App.tsx, src/index.css, public/vite.svg, vercel.json (if only rewrites)

# 4. Create the Next.js folders
mkdir -p src/app/\(auth\)/login src/app/\(dashboard\)
mkdir -p src/api/repositories src/api/services
mkdir -p src/components/layout src/components/skeleton src/components/features src/components/ui
mkdir -p src/data src/hooks src/lib src/styles src/types
touch src/app/layout.tsx src/app/globals.css src/app/not-found.tsx src/app/error.tsx
touch "src/app/(auth)/login/page.tsx" "src/app/(dashboard)/layout.tsx" "src/app/(dashboard)/page.tsx" "src/app/(dashboard)/loading.tsx"
touch src/proxy.ts src/api/apiClient.ts src/api/apiUrl.ts
touch src/lib/utils.ts src/lib/theme.ts src/lib/session.ts src/styles/theme.css src/types/index.ts
touch next.config.ts postcss.config.mjs eslint.config.mjs
```

Windows PowerShell: use `New-Item -ItemType Directory -Force "src/app/(auth)/login"` style commands instead of `mkdir -p` and `touch`.

`package.json` scripts:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

`postcss.config.mjs`:

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

`src/app/globals.css`:

```css
@import "tailwindcss";
@import "../styles/theme.css";
```

`tsconfig.json` must keep the alias `"paths": { "@/*": ["./src/*"] }` (the Next.js template sets this).

## Developer Workflow

### Before `git push`

1. **Branch from a fresh `develop`.** Never work directly on `main` or `develop`.
   ```bash
   git checkout develop && git pull
   git checkout -b feat/short-description
   ```
   Prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`.
2. **Code within the [Architecture Rules](#architecture-rules-enforced-by-eslint)**, [Next.js Conventions](#nextjs-conventions), [TypeScript](#typescript), and [Imports](#imports) sections below.
3. **Run the same checks CI runs.** All three must pass:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
4. **Review your diff.** Run `git status` and `git diff`. No `.env*` files, secrets, debug code, or unrelated changes.
5. **Commit** with a [conventional message](#commits--prs), e.g. `git commit -m "feat: add village directory page"`.
6. **Push.**
   ```bash
   git push -u origin feat/short-description
   ```

Before-push checklist:

- [ ] Branched from an up-to-date `develop`
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` all pass
- [ ] No `.env*` files or secrets in the diff
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

| Symptom                                                | Likely fix                                                                                        |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `no-restricted-imports` (layering)                     | You imported across layers. Go through a service.                                                 |
| `import/order`                                         | Reorder imports as described in [Imports](#imports).                                              |
| `tsc` errors                                           | Fix the types. Don't add `any` to silence them.                                                   |
| `npm ci` says lockfile out of sync                     | Run `npm install` locally and commit the updated `package-lock.json`.                             |
| Build error: hook or browser API in a Server Component | Add `"use client"` at the top of that file, or move the interactive part into a client component. |
| Build error: missing env variable                      | Compare `.env.example` with Vercel/GitHub settings.                                               |
| Build error about `params` / `cookies()`               | They are async in Next.js 16. `await` them.                                                       |

## Environment Variables

Next.js loads env files by mode. Only `.env.example` is committed. `.env.local` and `.env.test` are git-ignored.

| File         | Committed? | Loaded when                                 | Purpose                                    |
| ------------ | ---------- | ------------------------------------------- | ------------------------------------------ |
| .env.example | Yes        | Never loaded directly                       | Template listing every key, no real values |
| .env.local   | No         | Dev and `next build` / `next start` locally | Real values for your machine               |
| .env.test    | No         | Automated test runs                         | Mocked API base URL, dummy keys            |

```env
# .env.example

NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_APP_ORG_HEADER=
```

Rules:

- `NEXT_PUBLIC_*` variables are inlined into the browser bundle at build time, so they must be genuinely public. Never put a secret in one.
- Server-only secrets use plain names (no prefix) and are read only in Server Components, Route Handlers, or `proxy.ts`.
- Real per-environment values live in Vercel's project settings (marked Sensitive where applicable) and, for CI, in GitHub Actions secrets.
- `.gitignore` must contain `.env*` with an exception: `!.env.example`.

## Vercel Environments

| Environment | Branch trigger        | Purpose             | Who deploys       |
| ----------- | --------------------- | ------------------- | ----------------- |
| Development | develop / feature PRs | Integration testing | Auto, lead-gated  |
| Preview     | any PR branch         | Per-PR review link  | Auto on PR        |
| Production  | main                  | Live release        | Manual, lead only |

The Development and Production Vercel environments are configured as protected GitHub Environments requiring the lead's approval before a deployment job runs. In Vercel, set the framework preset to **Next.js** (no output directory or rewrites needed).

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
      - uses: actions/cache@v4
        with:
          path: .next/cache
          key: nextjs-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
          restore-keys: nextjs-${{ runner.os }}-
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
        env:
          NEXT_PUBLIC_API_BASE_URL: https://example.invalid
          NEXT_PUBLIC_APP_ORG_HEADER: ci

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

The CI build uses dummy `NEXT_PUBLIC_*` values only to prove the code compiles. Real values come from Vercel at deploy time.

Use one deploy path only. Because deployments are lead-gated through GitHub Environments, disable Vercel's own Git auto-deploy for gated branches, otherwise the app deploys twice and bypasses the approval.

### Lead's one-time setup

- **GitHub → Settings → Environments:** create `development` and `production`, and add the lead as **Required reviewer** on both.
- **GitHub → Settings → Secrets and variables → Actions:** add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- **GitHub → Settings → Branches:** protect `main` and `develop`. Require the `build-and-check` status check, at least one approving review, and up-to-date branches before merge.
- **Vercel → Project Settings → Environment Variables:** set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_APP_ORG_HEADER` separately for Development, Preview, and Production.
- Keep the [Vercel Environments](#vercel-environments) table above in sync with the real Vercel settings.

## Architecture Rules (enforced by ESLint)

- app/components → services → repositories → apiClient
- `api/repositories/`: raw API calls only. One file per feature. No business logic, no toasts, no state, no imports from `services/`.
- `api/services/`: business logic and error normalization (throw typed errors, return typed data). Calls `repositories/`, never `apiClient` directly. The only `api/` layer that `app/`, components, and hooks may import from. No toasts here, so services work in both Server and Client Components.
- User feedback (toasts, inline errors) is shown by client components and hooks that call services.
- `app/` / `components/` / `hooks/`: may import `services/`, `hooks/`, `lib/`, `components/ui/`. May not import `api/repositories/` or `api/apiClient` directly.
- `components/ui/`: dumb, reusable primitives only (Button, Input, Card). No feature-specific logic, no API imports.
- Endpoints are defined in `api/apiUrl.ts`, keyed by feature.

This is enforced by the `no-restricted-imports` rules in `eslint.config.mjs`. A PR that violates it fails `npm run lint` and therefore fails CI, not just code review.

## Next.js Conventions

- **Routes are thin.** `app/**/page.tsx` fetches or composes and renders components from `components/features/<feature>/`. Business UI does not live in `page.tsx`.
- **Server Components by default.** Add `"use client"` only to files that use state, effects, event handlers, or browser APIs. Keep client components small and push them to the leaves.
- **Required files per route area:** `loading.tsx` (skeleton from `components/skeleton/`) and `error.tsx` where the page fetches data.
- **Route groups:** `(auth)` for public pages, `(dashboard)` for protected pages. Their layouts differ, the URL does not change.
- **Protected routes:** `src/proxy.ts` redirects unauthenticated users to `/login`, and `(dashboard)/layout.tsx` verifies the session before rendering. Do not rely on client-side checks alone.
- **Session and tokens:** all token access goes through `lib/session.ts`. No page or component reads cookies, `localStorage`, or tokens directly.
- **`apiClient.ts`** centralizes the axios instance: attaches the auth token and org header on every request, and on 401 clears the session and redirects to `/login`.
- **Route Handlers (`app/api/**`)** only for things that must run on the server (for example setting the session cookie). Business endpoints belong to the backend, not here.
- **Images, links, fonts:** use `next/image`, `next/link`, and `next/font`. No raw `<img>` or `<a>` for internal navigation.
- **Metadata:** each route sets `export const metadata` (or `generateMetadata`) with a title.
- **Async request APIs:** `await params`, `await searchParams`, `await cookies()`, `await headers()`.

## TypeScript

- `strict: true` in `tsconfig.json`, no per-file opt-outs.
- `any` disallowed except at typed I/O boundaries, with a comment explaining why.
- Every shared shape (API DTOs, domain models) gets an explicit type in `src/types/`.

## Imports

Order (enforced by `import/order`): external packages → `@/api/*` → `@/components/*` → `@/hooks/*` → `@/lib/*` → relative imports. Use the `@/` alias for anything outside the current folder.

## Commits / PRs

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- PR must pass CI (lint + typecheck + build) before requesting review.
- PR description includes the preview URL once Vercel posts it.
- One feature or fix per PR. Keep PRs small.
- Explain any new dependency in the PR description.
- Never push directly to `main` or `develop`. Never merge with a red check or bypass branch protection. Never commit secrets or `.env*` files.

## Required Evidence per Milestone

For the "web shell + pipeline" milestone, attach in the PR description:

- [ ] Preview URL from the Vercel bot comment.
- [ ] Link to the passing GitHub Actions run, including the approved development deploy.
- [ ] The environment matrix table above, confirmed against actual Vercel project settings.
