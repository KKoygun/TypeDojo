import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { resolveProvider, PROVIDER_NAMES } from "../src/ai"
import { ProviderHttpError } from "../src/ai/providers/base"
import { ClaudeProvider } from "../src/ai/providers/claude"
import { GeminiProvider } from "../src/ai/providers/gemini"
import { OllamaProvider } from "../src/ai/providers/ollama"
import { GroqProvider, OpenAIProvider } from "../src/ai/providers/openaiCompatible"

interface Call {
  url: string
  headers: Record<string, string>
  body: any
}

// Stands in for fetch: records each request and answers with a fixed status and body
function fakeFetch(body: unknown, status = 200) {
  const calls: Call[] = []
  const fn = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({
      url: String(url),
      headers: (init?.headers ?? {}) as Record<string, string>,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    })
    return new Response(typeof body === "string" ? body : JSON.stringify(body), { status })
  }) as typeof fetch
  return { fn, calls }
}

const chatReply = { choices: [{ message: { content: "PASS fine" } }] }

describe("Groq and OpenAI (chat completions)", () => {
  test("Groq posts to its OpenAI-compatible endpoint with a bearer token", async () => {
    const { fn, calls } = fakeFetch(chatReply)
    assert.equal(await new GroqProvider("gk", "openai/gpt-oss-120b", fn).generate("hello"), "PASS fine")
    assert.equal(calls[0]!.url, "https://api.groq.com/openai/v1/chat/completions")
    assert.equal(calls[0]!.headers.Authorization, "Bearer gk")
    assert.deepEqual(calls[0]!.body, { model: "openai/gpt-oss-120b", messages: [{ role: "user", content: "hello" }], temperature: 0.1 })
  })

  test("OpenAI uses the same request against api.openai.com", async () => {
    const { fn, calls } = fakeFetch(chatReply)
    await new OpenAIProvider("ok", "gpt-x", fn).generate("hi")
    assert.equal(calls[0]!.url, "https://api.openai.com/v1/chat/completions")
  })

  test("lists model ids", async () => {
    const { fn, calls } = fakeFetch({ data: [{ id: "a" }, { id: "b" }] })
    assert.deepEqual(await new GroqProvider("gk", "", fn).listModels(), ["a", "b"])
    assert.equal(calls[0]!.url, "https://api.groq.com/openai/v1/models")
  })
})

describe("GeminiProvider", () => {
  test("sends the key in a header, not the URL", async () => {
    const { fn, calls } = fakeFetch({ candidates: [{ content: { parts: [{ text: "FAIL used any" }] } }] })
    assert.equal(await new GeminiProvider("secret", "gemini-x", fn).generate("hello"), "FAIL used any")
    assert.equal(calls[0]!.url, "https://generativelanguage.googleapis.com/v1beta/models/gemini-x:generateContent")
    assert.equal(calls[0]!.headers["x-goog-api-key"], "secret")
    assert.ok(!calls[0]!.url.includes("secret"))
    assert.deepEqual(calls[0]!.body.contents, [{ parts: [{ text: "hello" }] }])
  })

  test("an API error is thrown with its status and without the key", async () => {
    const { fn } = fakeFetch({ error: { code: 429, message: "quota" } }, 429)
    await assert.rejects(new GeminiProvider("secret", "gemini-x", fn).generate("x"), (e: Error) => {
      assert.match(e.message, /gemini returned 429/)
      assert.ok(!e.message.includes("secret"))
      return true
    })
  })

  test("lists only models that can generate content", async () => {
    const { fn } = fakeFetch({ models: [
      { name: "models/gemini-x", supportedGenerationMethods: ["generateContent"] },
      { name: "models/embed-y", supportedGenerationMethods: ["embedContent"] },
    ] })
    assert.deepEqual(await new GeminiProvider("k", "", fn).listModels(), ["gemini-x"])
  })

  test("falls back to a fixed message when there is no candidate", async () => {
    const { fn } = fakeFetch({})
    assert.equal(await new GeminiProvider("k", "gemini-x", fn).generate("x"), "No response from AI.")
  })
})

describe("ClaudeProvider", () => {
  test("posts to the Messages API and joins the text blocks", async () => {
    const { fn, calls } = fakeFetch({ content: [{ type: "text", text: "PASS " }, { type: "text", text: "clean" }] })
    assert.equal(await new ClaudeProvider("ck", "claude-x", fn).generate("hi"), "PASS clean")
    assert.equal(calls[0]!.url, "https://api.anthropic.com/v1/messages")
    assert.equal(calls[0]!.headers["x-api-key"], "ck")
    assert.equal(calls[0]!.headers["anthropic-version"], "2023-06-01")
    assert.equal(calls[0]!.body.model, "claude-x")
  })
})

describe("OllamaProvider", () => {
  test("adds the scheme to a bare OLLAMA_HOST and calls /api/chat without streaming", async () => {
    const { fn, calls } = fakeFetch({ message: { content: "PASS ok" } })
    assert.equal(await new OllamaProvider("llama3.1:8b", "127.0.0.1:11434", fn).generate("hi"), "PASS ok")
    assert.equal(calls[0]!.url, "http://127.0.0.1:11434/api/chat")
    assert.equal(calls[0]!.body.stream, false)
  })

  test("says to start Ollama when nothing is listening", async () => {
    const refused = (async () => { throw new TypeError("fetch failed") }) as typeof fetch
    await assert.rejects(new OllamaProvider("m", undefined, refused).generate("x"), /Is "ollama serve" running\?/)
  })
})

describe("ChatProvider rules", () => {
  test("refuses to call without a model", async () => {
    const { fn, calls } = fakeFetch(chatReply)
    await assert.rejects(new GroqProvider("gk", "", fn).generate("x"), /AI_MODEL is not set.*npm run models/)
    assert.equal(calls.length, 0)
  })

  test("turns a 404 into a message naming the model", async () => {
    const { fn } = fakeFetch({ error: "not found" }, 404)
    await assert.rejects(new GroqProvider("gk", "old-model", fn).generate("x"), (e: unknown) => {
      assert.ok(e instanceof ProviderHttpError && e.status === 404)
      assert.match((e as Error).message, /groq has no model "old-model".*npm run models/)
      return true
    })
  })
})

describe("resolveProvider", () => {
  test("defaults to groq and reads GROQ_API_KEY and AI_MODEL", () => {
    const r = resolveProvider({ GROQ_API_KEY: "gk", AI_MODEL: "m" })
    assert.ok("provider" in r)
    assert.equal(r.provider.name, "groq")
    assert.equal(r.provider.model, "m")
  })

  test("each provider reads its own key, so one .env can hold several", () => {
    const env = { GROQ_API_KEY: "g", GEMINI_API_KEY: "ge", ANTHROPIC_API_KEY: "a", OPENAI_API_KEY: "o", AI_MODEL: "m" }
    for (const name of PROVIDER_NAMES) {
      const r = resolveProvider({ ...env, AI_PROVIDER: name })
      assert.ok("provider" in r, name)
      assert.equal(r.provider.name, name)
    }
  })

  test("says which key is missing", () => {
    assert.deepEqual(resolveProvider({ AI_PROVIDER: "gemini", AI_MODEL: "m" }), { disabled: "set GEMINI_API_KEY for AI_PROVIDER=gemini" })
  })

  test("has no default model", () => {
    const r = resolveProvider({ GROQ_API_KEY: "gk" })
    assert.ok("disabled" in r && /set AI_MODEL/.test(r.disabled))
  })

  test("npm run models can build a provider without a model", () => {
    assert.ok("provider" in resolveProvider({ GROQ_API_KEY: "gk" }, false))
  })

  test("Ollama needs no key", () => {
    const r = resolveProvider({ AI_PROVIDER: "ollama", AI_MODEL: "llama3.1:8b" })
    assert.ok("provider" in r && r.provider.name === "ollama")
  })

  test("rejects an unknown provider by name", () => {
    const r = resolveProvider({ AI_PROVIDER: "mistral", AI_MODEL: "m" })
    assert.ok("disabled" in r && /"mistral" is not one of groq, gemini, claude, openai, ollama/.test(r.disabled))
  })
})
