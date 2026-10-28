// The only thing a model backend has to do: take a prompt, return text.
// Prompt building and verdict parsing live in Tutor, so a new backend (Claude, OpenAI,
// a local model) is one small class and feature code never imports it directly.
export interface AIProvider {
  // Identifies the backend in recordings, e.g. "gemini"
  readonly name: string
  readonly model: string
  generate(prompt: string): Promise<string>
}

export interface EvalResult {
  pass: boolean
  feedback: string
}
