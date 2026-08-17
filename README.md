# EY.ai Tax Labs

Interactive learning hub for EY tax professionals. Learners move through AI foundations, prompting, Microsoft 365 Copilot, and responsible-use practice.

This is the working application only.

## Run locally

You need [Node.js](https://nodejs.org/) 20+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (port **5174**).

```bash
pnpm build      # production build
pnpm typecheck  # TypeScript check
```

## Pages

| Path | What it is |
|------|------------|
| `/` | Four-phase journey home |
| `/phase1` | Phase 1 module hub |
| `/foundational` | Foundational Concepts of AI |
| `/ai-tax-prompting` | AI Tax Prompting |
| `/copilot-hub` | M365 Copilot Hub |
| `/phase2` | Phase 2 — Brainstorming use cases |
| `/guidance-implementation` | Phase 3 — Guidance for implementation |
| `/closure-ai-reinforcement` | Phase 4 — Closure and AI reinforcement |
| `/control-room.html` | Responsible AI Control Room (10-scenario assessment) |

## Deploy

The app is a Vite single-page app. `vercel.json` already rewrites unknown paths to `/` so in-app routes work on [Vercel](https://vercel.com).

## Stack

React 18, TypeScript, Vite 6, React Router 7, Tailwind CSS 4, EY design tokens in `src/design-kit/`.
