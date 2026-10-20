# TypeDojo

[![CI](https://github.com/KKoygun/TypeDojo/actions/workflows/ci.yml/badge.svg)](https://github.com/KKoygun/TypeDojo/actions/workflows/ci.yml)

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

Draft topics are tagged `[preview]` in both `learn` and `map`.

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
- **Ask AI** — ask a question about the challenge without getting the answer handed to you

The Gemini free tier is more than enough — the entire curriculum uses under 100k tokens even with heavy use of insights.

### How reliable is the AI review?

`evals/approach/` holds 14 hand-labelled solutions (7 good, 7 bad). All 14 pass their challenge's runtime tests, so only the AI review can tell them apart. `npm run ai:record` runs them against Gemini and reports how often it agrees with the labels; `npm run ai:eval` replays those recordings offline. No recordings are committed yet, so there is no agreement figure to quote. See [evals/approach/README.md](evals/approach/README.md).

## Progress

Progress is saved locally in `.progress.json`. Delete it to start over.

## Development

```bash
npm run typecheck      # tsc over src, tests and reference solutions
npm test               # harness tests (node:test, no network)
npm run validate       # every validated challenge: reference passes, template fails
npm run check:meta     # meta.json files against the Zod schema
npm run readme         # regenerate the topic table and status counts above
npm run ai:eval -- --check   # golden set cases all pass their runtime tests (no AI)
```

CI runs all of these on every push. How the pieces fit together: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

**Spoiler warning:** `reference/` holds a working solution for every coding challenge in the validated topics, so `npm run validate` can prove the tests work. Don't open it if you want to solve them yourself.

## Stack

- TypeScript + ts-node
- Chalk + Inquirer for the terminal UI
- Zod for the challenge metadata schema
- Gemini 3.1 Flash Lite for AI evaluation (free tier). The provider sits behind a small interface in `src/ai/`, so another model is one new class.

## License

[MIT](LICENSE)
