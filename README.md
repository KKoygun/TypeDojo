# TypeDojo

A terminal-based TypeScript learning curriculum — from first types to advanced patterns.

129 challenges across 18 topics. Difficulty ramps gradually within each topic. AI-assisted code review is available on-demand with a free Gemini API key.

## Topics

| # | Topic | Challenges |
|---|---|---|
| 01 | The Type System | 6 |
| 02 | Interfaces & Object Shapes | 6 |
| 03 | Generics | 7 |
| 04 | Async & Promises | 9 |
| 05 | Utility Types | 8 |
| 06 | Error Handling | 8 |
| 07 | Modules & Tooling | 5 |
| 08 | Advanced Types | 7 |
| 09 | Runtime Tooling | 7 |
| 10 | Production Patterns | 9 |
| 11 | Classes & OOP | 7 |
| 12 | Enums, Tuples & Const Assertions | 7 |
| 13 | Type Guards & Declaration Merging | 7 |
| 14 | Zod & Schema Validation | 7 |
| 15 | Testing & Node.js Streams | 7 |
| 16 | Intersection Types & Function Overloads | 7 |
| 17 | Sync Generators & Iterators | 7 |
| 18 | Structural Typing, satisfies & Index Signatures | 8 |

## Getting started

```bash
git clone <repo>
cd typescript-game
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
challenges/typescript/01-types/types-04/
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
- Gemini 1.5 Flash for AI evaluation (swappable — see `src/ai/`)
