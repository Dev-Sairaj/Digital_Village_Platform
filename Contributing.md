# Contributing / Project Rules

Single source of truth for stack, structure, setup, environments, CI/CD, and architecture conventions. If it's not here or in an actual config file (.eslintrc.cjs, .prettierrc, tsconfig.json), it isn't a rule — raise it in a PR to add it here first.

## Stack

| Tool       | Version / Choice                      |
| ---------- | ------------------------------------- |
| Node.js    | 24.x (nvm install 24 && nvm use 24)   |
| npm        | 11.x (npm install -g npm@11)          |
| Framework  | React 18 + TypeScript (Vite)          |
| Routing    | react-router-dom                      |
| HTTP       | axios                                 |
| Styling    | Tailwind CSS + CSS custom properties  |
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

## One-Time Setup

```bash
# 1. Toolchain

nvm install 24 && nvm use 24
npm install -g npm@11

# 2. Scaffold (React + TypeScript via Vite)

npm create vite@latest web-app -- --template react-ts
cd web-app
npm install

# 3. Core dependencies

npm install axios react-router-dom

# 4. Styling

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 5. Linting / formatting (eslint-plugin-boundaries enforces the layering rules below)

npm install -D eslint prettier eslint-config-prettier \
eslint-plugin-react eslint-plugin-react-hooks \
eslint-plugin-import eslint-plugin-boundaries \
@typescript-eslint/parser @typescript-eslint/eslint-plugin

# 6. Folder structure

mkdir -p src/api/repositories src/api/services
mkdir -p src/components/layout src/components/skeleton src/components/ui
mkdir -p src/data src/hooks src/lib src/pages src/styles src/types

# 7. Seed files

touch src/api/apiClient.ts src/api/apiUrl.ts
touch src/lib/utils.ts src/lib/theme.ts
touch src/styles/theme.css
touch src/types/index.ts
touch .env.example .env .env.test vercel.json
echo -e ".env\n.env.test" >> .gitignore

# 8. CI scaffolding

mkdir -p .github/workflows
touch .github/workflows/ci.yml
```

## Environment Variables

Vite loads env files by mode. Only .env.example is committed — .env and .env.test are git-ignored.

| File         | Committed? | Loaded when                           | Purpose                                                            |
| ------------ | ---------- | ------------------------------------- | ------------------------------------------------------------------ |
| .env.example | Yes        | Never loaded directly                 | Template listing every key, no real values                         |
| .env         | No         | Always (dev/local + production build) | Real values for whichever environment you're running               |
| .env.test    | No         | vite --mode test / CI test runs       | Values for automated tests (mocked API base URL, dummy keys, etc.) |

```env
# .env.example

VITE_API_BASE_URL=
VITE_APP_ORG_HEADER=
```

Real per-environment values live only in Vercel's project settings (marked Sensitive, never exposed to client bundles unless prefixed VITE_ and genuinely public) and, for CI, in GitHub Actions secrets consumed to write a throwaway .env.test before running the test job.

## Vercel Environments

| Environment | Branch trigger        | Purpose             | Who deploys       |
| ----------- | --------------------- | ------------------- | ----------------- |
| Development | develop / feature PRs | Integration testing | Auto, lead-gated  |
| Preview     | any PR branch         | Per-PR review link  | Auto on PR        |
| Production  | main                  | Live release        | Manual, lead only |

The Development and Production Vercel environments are configured as protected GitHub Environments requiring the lead's approval before a deployment job runs.

## GitHub Actions — CI Gate

.github/workflows/ci.yml runs on every PR and must pass before merge:

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
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run build

  deploy-development:
    needs: build-and-check
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment:
      name: development # requires lead approval — configure under # Settings > Environments > development > Required reviewers
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploy step calls Vercel CLI / vercel-action here"
```

Branch protection on main and develop must require: this workflow passing, at least one approving review, and up-to-date branches before merge.

If/when a test job is added, it should write .env.test from GitHub Actions secrets at the start of the job, so Vite picks it up via vite --mode test, then run it before build-and-check.

## Architecture Rules (enforced by ESLint)

- pages/components → services → repositories → apiClient
- api/repositories/ — raw API calls only. One file per feature. No business logic, no toasts, no state, no imports from services/.
- api/services/ — business logic + user feedback (toasts/errors). Calls repositories/, never apiClient directly. The only api/ layer pages/components may import from.
- pages/ / components/ — may import services/, hooks/, lib/, components/ui/. May not import api/repositories/ directly.
- components/ui/ — dumb, reusable primitives only (Button, Input, Card). No feature-specific logic, no API imports.

This is enforced by the boundaries/element-types rule in .eslintrc.cjs — a PR that violates it fails npm run lint and therefore fails CI, not just code review.

## TypeScript

- strict: true in tsconfig.json, no per-file opt-outs.
- any disallowed except at typed I/O boundaries, with a comment explaining why.
- Every shared shape (API DTOs, domain models) gets an explicit type in src/types/.

## Imports

Order (enforced by eslint-plugin-import's order rule): external packages → @/api/* → @/components/* → @/hooks/* → @/lib/* → relative imports.

## Authentication & Routing

- App.tsx defines all routes and wraps protected ones in <ProtectedRoute>, which checks auth state before rendering; unauthenticated users redirect to /login.
- apiClient.ts centralizes the axios instance: attaches auth token + org header on every request, and on 401 clears the session and redirects to /login.
- No page/component reads localStorage/tokens directly — always go through services/hooks.

## Commits / PRs

- Conventional commits (feat:, fix:, chore:, ...).
- PR must pass CI (lint + tsc --noEmit + build) before requesting review.
- PR description includes the preview URL once Vercel posts it.

## Required Evidence per Milestone

For the "web shell + pipeline" milestone, attach in the PR description:

- Preview URL from the Vercel bot comment on the PR.
- Link to the passing GitHub Actions run.
- The environment matrix table above, confirmed against actual Vercel project settings.
