import * as fs from "fs"
import * as path from "path"
import { AIProvider } from "./provider"
import { ChatProvider } from "./providers/base"
import { ClaudeProvider } from "./providers/claude"
import { GeminiProvider } from "./providers/gemini"
import { OllamaProvider } from "./providers/ollama"
import { GroqProvider, OpenAIProvider } from "./providers/openaiCompatible"
import { Cassette, RecordingProvider, ReplayProvider } from "./recording"
import { Tutor } from "./tutor"

// live:   call the real model
// record: call the real model and save each response under cassetteDir/<provider>
export type AIMode = "live" | "record"

export const DEFAULT_CASSETTE_DIR = path.join(__dirname, "../../evals/approach/cassettes")

export const PROVIDER_NAMES = ["groq", "gemini", "claude", "openai", "ollama"] as const
export type ProviderName = (typeof PROVIDER_NAMES)[number]

// Each provider reads its own key, so one .env can hold several and AI_PROVIDER picks between them
export const KEY_VARS: Record<ProviderName, string | null> = {
  groq: "GROQ_API_KEY",
  gemini: "GEMINI_API_KEY",
  claude: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  ollama: null,
}

export type Resolved = { provider: ChatProvider } | { disabled: string }

// Picks the backend from AI_PROVIDER (default groq) and AI_MODEL. There is no default model:
// AI stays off and says what to set. requireModel is false only for npm run models.
export function resolveProvider(env: NodeJS.ProcessEnv = process.env, requireModel = true): Resolved {
  const name = (env.AI_PROVIDER || "groq").toLowerCase()
  if (!(PROVIDER_NAMES as readonly string[]).includes(name)) {
    return { disabled: `AI_PROVIDER "${name}" is not one of ${PROVIDER_NAMES.join(", ")}` }
  }
  const provider = name as ProviderName
  const keyVar = KEY_VARS[provider]
  const key = keyVar ? env[keyVar] ?? "" : ""
  if (keyVar && !key) return { disabled: `set ${keyVar} for AI_PROVIDER=${provider}` }

  const model = env.AI_MODEL ?? ""
  if (requireModel && !model) return { disabled: `set AI_MODEL (npm run models lists the ${provider} models you can use)` }

  switch (provider) {
    case "groq": return { provider: new GroqProvider(key, model) }
    case "openai": return { provider: new OpenAIProvider(key, model) }
    case "gemini": return { provider: new GeminiProvider(key, model) }
    case "claude": return { provider: new ClaudeProvider(key, model) }
    case "ollama": return { provider: new OllamaProvider(model, env.OLLAMA_HOST || undefined) }
  }
}

export function createProvider(mode: AIMode = "live", cassetteDir = DEFAULT_CASSETTE_DIR): AIProvider | null {
  const resolved = resolveProvider()
  if (!("provider" in resolved)) return null
  const live = resolved.provider
  return mode === "record" ? new RecordingProvider(live, path.join(cassetteDir, live.name)) : live
}

// One replay provider per recorded backend (cassetteDir/<provider>), each answering
// only for the model it was recorded with. Offline, no key needed.
export function recordedProviders(cassetteDir = DEFAULT_CASSETTE_DIR): ReplayProvider[] {
  if (!fs.existsSync(cassetteDir)) return []
  return fs.readdirSync(cassetteDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => {
      const dir = path.join(cassetteDir, d.name)
      const models = new Set(
        fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
          .map((f) => (JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Cassette).model)
      )
      return [...models].map((model) => new ReplayProvider(dir, d.name, model))
    })
}

export function createTutor(mode: AIMode = "live", cassetteDir = DEFAULT_CASSETTE_DIR): Tutor | null {
  const provider = createProvider(mode, cassetteDir)
  return provider ? new Tutor(provider) : null
}

export type { AIProvider, EvalResult } from "./provider"
export { Tutor } from "./tutor"
