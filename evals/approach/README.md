# AI approach eval

The runtime tests check what a solution returns. The AI approach evaluation checks how it was written (no `any`, no hardcoded answers, the construct the challenge asks for). This folder measures how often that evaluation gets it right.

- `golden.json`: 14 hand-labelled cases from the validated topics, 7 expected PASS and 7 expected FAIL, each with a reason.
- `cases/`: the solution file for each case.
- `cassettes/<provider>/`: recorded model responses, one JSON file per prompt. Created by `npm run ai:record`.

Every case, good or bad, passes its challenge's runtime tests. So the tests alone would pass all 14, and the AI review is the only thing that can separate them. `npm run ai:eval -- --check` proves that premise without calling any model.

## Commands

```bash
npm run ai:eval -- --check   # no AI: every case compiles and passes its runtime tests
npm run ai:record            # calls AI_PROVIDER / AI_MODEL from .env, saves responses, reports agreement
npm run ai:eval              # replays every recorded provider offline and reports agreement for each
```

A recording is keyed by provider, model and the exact prompt. Editing `src/ai/prompts/evaluate.md`, a challenge description or a case file changes the prompt, so the old recording stops matching. Replay then reports the case as missing rather than reusing a stale answer. Re-record after such changes.

Recordings contain the full prompt and the model's reply. They never contain the API key.

## Results

Recorded on 2026-10-28. `npm run ai:eval` replays these offline.

| Provider · model | Agreement | Bad solutions let through | Good solutions rejected |
|---|---|---|---|
| groq · `openai/gpt-oss-120b` | 14/14 | 0 | 0 |
| gemini · `gemini-3.1-flash-lite` | 14/14 | 0 | 0 |

A second live run on Groq, not saved, also agreed on 14/14.

**The first run scored lower, and the difference is worth stating.** Groq agreed on 11/14: no bad solution got through, but three good ones were rejected. Reading the model's reasons showed one prompt flaw and two content bugs, not a weak model:

| Case | Model's reason | Who was right | Fix |
|---|---|---|---|
| `good-types-02-annotated` | added an `export` keyword | the model was wrong: the template already had it, but the prompt never showed the template | the evaluate prompt now includes the starter code, marked as not the student's choice |
| `good-interfaces-04-template-literal` | should return the fixed string `http://localhost:8080` | the challenge text said exactly that, while its tests check four hosts | the text now says to build the URL from the config |
| `good-async-05-promise-all` | the functions return at once instead of after a short delay | the model was right: the challenge asks for a delay, and the case (and the reference solution) skipped it | the reference and both async-05 cases now wait |

These fixes were made after seeing the results and the same 14 cases were then re-recorded, so 14/14 says the reviewer and the cases now agree. It does not say how the reviewer does on solutions it has never seen. Fourteen cases is small: it shows the review separates the patterns these cases target, not that it is right on any solution. New cases should be added before changing the prompt again.
