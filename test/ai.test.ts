import { test, describe, after } from "node:test"
import assert from "node:assert/strict"
import { AIProvider } from "../src/ai/provider"
import { Tutor, parseVerdict, loadPrompt } from "../src/ai/tutor"
import { GeminiProvider } from "../src/ai/providers/gemini"
import { RecordingProvider, ReplayProvider, NoRecordingError } from "../src/ai/recording"
import { createProvider } from "../src/ai"
import { scratchDir, removeDir } from "./helpers"

class FakeProvider implements AIProvider {
  readonly name = "fake"
  readonly model = "fake-1"
  prompts: string[] = []
  constructor(private responses: string[]) {}
  async generate(prompt: string): Promise<string> {
    this.prompts.push(prompt)
    return this.responses.shift() ?? "FAIL no scripted response"
  }
}

describe("parseVerdict", () => {
  const cases: [string, boolean, string][] = [
    ["PASS You used a union type.", true, "You used a union type."],
    ["FAIL You hardcoded the value.", false, "You hardcoded the value."],
    ["**PASS** Clean use of Promise.all.", true, "Clean use of Promise.all."],
    ["  pass: fine", true, "fine"],
    ["I think this is correct", false, "I think this is correct"],
    ["PASSABLE but sloppy", false, "PASSABLE but sloppy"],
  ]
  for (const [input, pass, feedback] of cases) {
    test(JSON.stringify(input), () => assert.deepEqual(parseVerdict(input), { pass, feedback }))
  }
})

describe("Tutor", () => {
  test("evaluate sends the evaluator prompt, the challenge and the code", async () => {
    const fake = new FakeProvider(["PASS Correct generic."])
    const result = await new Tutor(fake).evaluate("Write wrap<T>", "export function wrap() {}")
    assert.deepEqual(result, { pass: true, feedback: "Correct generic." })
    const prompt = fake.prompts[0]!
    assert.ok(prompt.startsWith(loadPrompt("evaluate")))
    assert.match(prompt, /CHALLENGE:\nWrite wrap<T>/)
    assert.match(prompt, /SOLUTION:\nexport function wrap\(\) \{\}/)
  })

  test("insight does not use the strict evaluator prompt", async () => {
    const fake = new FakeProvider(["Try a generic."])
    assert.equal(await new Tutor(fake).insight("desc", "code", "TS2322"), "Try a generic.")
    assert.ok(!fake.prompts[0]!.includes(loadPrompt("evaluate")))
    assert.match(fake.prompts[0]!, /Error they got:\nTS2322/)
  })

  test("ask uses the ask prompt and tells the model not to solve the challenge", async () => {
    const fake = new FakeProvider(["Because of inference."])
    await new Tutor(fake).ask("why?", "const x = 1", "Annotate x")
    const prompt = fake.prompts[0]!
    assert.ok(prompt.startsWith(loadPrompt("ask")))
    assert.match(prompt, /do NOT solve it/)
    assert.match(prompt, /```typescript\nconst x = 1\n```/)
  })

  test("ask leaves out the code block when there is no code", async () => {
    const fake = new FakeProvider(["ok"])
    await new Tutor(fake).ask("why?", "   ")
    assert.ok(!fake.prompts[0]!.includes("```typescript"))
  })
})

describe("GeminiProvider", () => {
  test("posts the prompt to the configured model and returns the text", async () => {
    let sent: { url: string; body: string } | undefined
    const gemini = new GeminiProvider("test-key", async (url, body) => {
      sent = { url, body }
      return JSON.stringify({ candidates: [{ content: { parts: [{ text: "PASS fine" }] } }] })
    })
    assert.equal(await gemini.generate("hello"), "PASS fine")
    assert.match(sent!.url, /models\/gemini-3\.1-flash-lite:generateContent\?key=test-key$/)
    assert.deepEqual(JSON.parse(sent!.body), { contents: [{ parts: [{ text: "hello" }] }] })
  })

  test("turns an API error body into a thrown error", async () => {
    const gemini = new GeminiProvider("k", async () => JSON.stringify({ error: { code: 429, message: "quota" } }))
    await assert.rejects(gemini.generate("x"), /Gemini API error 429: quota/)
  })

  test("falls back to a fixed message when there is no candidate", async () => {
    const gemini = new GeminiProvider("k", async () => "{}")
    assert.equal(await gemini.generate("x"), "No response from AI.")
  })
})

describe("record and replay", () => {
  const dir = scratchDir("cassettes")
  after(() => removeDir(dir))

  test("a recorded response replays offline for the same prompt", async () => {
    const recorder = new RecordingProvider(new FakeProvider(["FAIL used any"]), dir)
    assert.equal(await recorder.generate("prompt A"), "FAIL used any")

    const replay = new ReplayProvider(dir, "fake", "fake-1")
    assert.equal(replay.has("prompt A"), true)
    assert.equal(await replay.generate("prompt A"), "FAIL used any")
  })

  test("a changed prompt does not reuse an old recording", async () => {
    const replay = new ReplayProvider(dir, "fake", "fake-1")
    assert.equal(replay.has("prompt A, edited"), false)
    await assert.rejects(replay.generate("prompt A, edited"), NoRecordingError)
  })

  test("recordings from another model are not used", async () => {
    await assert.rejects(new ReplayProvider(dir, "fake", "fake-2").generate("prompt A"), NoRecordingError)
  })
})

describe("createProvider", () => {
  const savedKey = process.env.GEMINI_API_KEY
  after(() => {
    if (savedKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = savedKey
  })

  test("live mode without a key disables AI", () => {
    delete process.env.GEMINI_API_KEY
    assert.equal(createProvider("live"), null)
  })

  test("replay mode needs no key", () => {
    delete process.env.GEMINI_API_KEY
    assert.ok(createProvider("replay") instanceof ReplayProvider)
  })
})
