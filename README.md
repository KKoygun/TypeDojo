# TypeDojo

A terminal-based TypeScript learning curriculum — from JavaScript fundamentals to advanced patterns.

Difficulty ramps gradually within each topic. AI-assisted code review is available on-demand with a free Gemini API key.

<!-- generated:topics:start -->
154 challenges across 19 topics. 52 challenges in 5 topics are validated; the other 102 are drafts, shown as "preview" in the app.

## Status

| Status | Topics | Challenges |
|---|---|---|
| Validated | 5 | 52 |
| Draft (preview) | 14 | 102 |

**Validated** means every coding challenge in the topic has a reference solution (in `reference/`) that passes its tests, and the untouched template fails them. `npm run validate` checks this in CI. Exception: `types-02` only asks for type annotations, which a runtime test cannot see, so the compile step and the AI review grade it instead. **Draft** topics are playable but have not been through that check and may change.

## Topics

| # | Topic | Challenges | Status |
|---|---|---|---|
| 01 | JavaScript Essentials | 16 | validated |
| 02 | The Type System | 9 | validated |
| 03 | Interfaces & Object Shapes | 9 | validated |
| 04 | Generics | 9 | validated |
| 05 | Async & Promises | 9 | validated |
| 06 | Utility Types | 9 | preview |
| 07 | Error Handling | 8 | preview |
| 08 | Modules & Tooling | 5 | preview |
| 09 | Advanced Types | 7 | preview |
| 10 | Runtime Tooling | 7 | preview |
| 11 | Production Patterns | 9 | preview |
| 12 | Classes & OOP | 7 | preview |
| 13 | Enums, Tuples & Const Assertions | 7 | preview |
| 14 | Type Guards & Declaration Merging | 7 | preview |
| 15 | Zod & Schema Validation | 7 | preview |
| 16 | Testing & Node.js Streams | 7 | preview |
| 17 | Intersection Types & Function Overloads | 7 | preview |
| 18 | Sync Generators & Iterators | 7 | preview |
| 19 | Structural Typing, satisfies & Index Signatures | 8 | preview |
<!-- generated:topics:end -->

## Getting started

```bash
git clone https://github.com/KKoygun/TypeDojo
cd TypeDojo
npm install
npm run learn
```

## Commands

```bash
npm run learn          # browse topics and start a challenge
npm run check <id>     # validate a file challenge (e.g. npm run check types-04)
npm run map            # see full progress overview
```

## Challenge types

**Q&A** — answer directly in the terminal. Instant feedback, no files needed.

**File** — edit a solution file in your editor, then run `npm run check <id>` to validate.

```
challenges/typescript/02-types/types-04/
  template.ts   ← copied to solution.ts on first run
  solution.ts   ← you edit this (gitignored)
  tests.ts      ← automated test cases
```

## AI features (optional)

Copy `.env.example` to `.env` and add a Gemini API key:

```bash
cp .env.example .env
# edit .env and add your key
```

With a key enabled, file challenges gain two extra features after the test cases run:

- **AI approach evaluation** — checks that you solved it the right way, not just that the output matches
- **AI insight** — if you're stuck, request specific feedback on your actual code

The Gemini free tier is more than enough — the entire curriculum uses under 100k tokens even with heavy use of insights.

## Progress

Progress is saved locally in `.progress.json`. Delete it to start over.

## Stack

- TypeScript + ts-node
- Chalk + Inquirer for the terminal UI
- Gemini 3.1 Flash Lite for AI evaluation (free tier — swappable, see `src/ai/`)
