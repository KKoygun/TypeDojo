import * as path from "path"
import { AIProvider } from "./provider"
import { GEMINI_MODEL, GeminiProvider } from "./providers/gemini"
import { RecordingProvider, ReplayProvider } from "./recording"
import { Tutor } from "./tutor"

// live:   call the real model (needs GEMINI_API_KEY)
// record: call the real model and save each response under cassetteDir
// replay: answer only from saved responses, offline, no key needed
export type AIMode = "live" | "record" | "replay"

export const DEFAULT_CASSETTE_DIR = path.join(__dirname, "../../evals/approach/cassettes")

export function createProvider(mode: AIMode = "live", cassetteDir = DEFAULT_CASSETTE_DIR): AIProvider | null {
  if (mode === "replay") return new ReplayProvider(cassetteDir, "gemini", GEMINI_MODEL)

  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  // Swap the model backend here; nothing else in the app imports a provider directly
  const live: AIProvider = new GeminiProvider(key)
  return mode === "record" ? new RecordingProvider(live, cassetteDir) : live
}

export function createTutor(mode: AIMode = "live", cassetteDir = DEFAULT_CASSETTE_DIR): Tutor | null {
  const provider = createProvider(mode, cassetteDir)
  return provider ? new Tutor(provider) : null
}

export type { AIProvider, EvalResult } from "./provider"
export { Tutor } from "./tutor"
