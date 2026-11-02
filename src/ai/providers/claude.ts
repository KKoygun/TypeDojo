import { ChatProvider, Fetch } from "./base"

const API = "https://api.anthropic.com/v1"

// Anthropic Messages API. Key: https://console.anthropic.com (separate from a Claude.ai plan)
export class ClaudeProvider extends ChatProvider {
  readonly name = "claude"

  constructor(private apiKey: string, model: string, fetchFn?: Fetch) {
    super(model, fetchFn)
  }

  private get auth() {
    return { "x-api-key": this.apiKey, "anthropic-version": "2023-06-01" }
  }

  async listModels(): Promise<string[]> {
    const body = (await this.request(`${API}/models?limit=1000`, { headers: this.auth })) as { data?: { id: string }[] }
    return (body.data ?? []).map((m) => m.id)
  }

  protected async send(prompt: string): Promise<string> {
    const body = (await this.postJson(
      `${API}/messages`,
      { model: this.model, max_tokens: 1024, temperature: 0.1, messages: [{ role: "user", content: prompt }] },
      this.auth
    )) as { content?: { type: string; text?: string }[] }
    const text = (body.content ?? []).map((b) => (b.type === "text" ? b.text ?? "" : "")).join("")
    return text || "No response from AI."
  }
}
