# SMIV Web Shell

Foundational web application for the [SMIV / SmartVillage] platform — a React +
TypeScript client with routing, authenticated API access, and a lead-controlled
deployment pipeline (GitHub Actions → Vercel).

This repo is the shared starting point for the team: it exists so every feature gets
built on the same folder structure, the same API/auth layering, and the same
CI/CD gates, rather than everyone improvising their own.

**Before writing any code, read [`Contributing.md`](./Contributing.md).** It has the
stack, folder structure, setup commands, environment variables, CI/CD and Vercel
environment setup, and the architecture rules (enforced by ESLint) that every PR must
follow.

## Quick Start

```bash
git clone <repo-url>
cd <repo>
cp .env.example .env   # fill in real values, see Contributing.md
npm install
npm run dev
```

## Status

Milestone: **web shell + lead-owned deployment pipeline**. Acceptance criteria and
required evidence (preview URL, pipeline run, environment matrix) are tracked in
`Contributing.md`.
