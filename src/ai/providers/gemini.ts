import { ChatProvider, Fetch } from "./base"

const API = "https://generativelanguage.googleapis.com/v1beta"

// Free tier. Key: https://aistudio.google.com/apikey
// The key goes in a header rather than the URL, so it never shows up in an error message.
export class GeminiProvider extends ChatProvider {
  readonly name = "gemini"

  constructor(private apiKey: string, model: string, fetchFn?: Fetch) {
    super(model, fetchFn)
  }

  private get auth() {
    return { "x-goog-api-key": this.apiKey }
  }

  async listModels(): Promise<string[]> {
    const body = (await this.request(`${API}/models?pageSize=1000`, { headers: this.auth })) as {
      models?: { name: string; supportedGenerationMethods?: string[] }[]
    }
    return (body.models ?? [])
      .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => m.name.replace(/^models\//, ""))
  }

  protected async send(prompt: string): Promise<string> {
    const body = (await this.postJson(
      `${API}/models/${this.model}:generateContent`,
      { contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1 } },
      this.auth
    )) as { candidates?: { content?: { parts?: { text?: string }[] } }[] }
    return body.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from AI."
  }
}
