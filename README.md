# Slalom HandoffIQ

An AI-powered tool for Salesforce and IT implementation teams that analyses project handoff artifacts (user stories, solution designs, requirements docs) and tells the receiving team whether they are ready to start work.

A Slalom delivery accelerator.

## Modes

- **Sprint Ready (Agile)** — Analyses each user story individually against a Definition of Ready checklist. Returns a per-story READY / REFINE / DEFER verdict with specific fixes and a fully rewritten improved version of each story.
- **Gate / Handoff** — Evaluates the full document package for completeness and quality across 6 dimensions. Produces an improvement plan with NFR recommendations, story rewrites, and Salesforce capability mapping.

## Stack

- React 18 + Vite
- `mammoth` for DOCX extraction, PDF.js (loaded at runtime from CDN) for PDF
- Calls Claude / OpenAI for the analysis

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173.

## API key

The app needs an API key for whichever LLM provider it's configured against. Set it in a local `.env` file (gitignored):

```
VITE_LLM_API_KEY=your-key-here
```

Never commit `.env` — it's in `.gitignore`.

## Build

```bash
npm run build
```

Outputs a static bundle in `dist/`.

## Status

Early prototype. See the About page (coming) for objectives, vision, and team.
