import { AIProvider } from "./provider"
import { GeminiProvider } from "./gemini"

export function createAIProvider(): AIProvider | null {
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  return new GeminiProvider(key)
}

export type { AIProvider, EvalResult } from "./provider"
