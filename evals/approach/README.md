# AI approach eval

The runtime tests check what a solution returns. The AI approach evaluation checks how it was written (no `any`, no hardcoded answers, the construct the challenge asks for). This folder measures how often that evaluation gets it right.

- `golden.json`: 14 hand-labelled cases from the validated topics, 7 expected PASS and 7 expected FAIL, each with a reason.
- `cases/`: the solution file for each case.
- `cassettes/`: recorded model responses, one JSON file per prompt. Created by `npm run ai:record`.

Every case, good or bad, passes its challenge's runtime tests. So the tests alone would pass all 14, and the AI review is the only thing that can separate them. `npm run ai:eval -- --check` proves that premise without calling any model.

## Commands

```bash
npm run ai:eval -- --check   # no AI: every case compiles and passes its runtime tests
npm run ai:record            # calls Gemini (needs GEMINI_API_KEY), saves responses, reports agreement
npm run ai:eval              # replays saved responses offline and reports agreement
```

A recording is keyed by provider, model and the exact prompt. Editing `src/ai/prompts/evaluate.md`, a challenge description or a case file changes the prompt, so the old recording stops matching. Replay then reports the case as missing rather than reusing a stale answer. Re-record after such changes.

Recordings contain the full prompt and the model's reply. They never contain the API key.
