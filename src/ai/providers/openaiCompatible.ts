import { ChatProvider, Fetch } from "./base"

interface ChatCompletion {
  choices?: { message?: { content?: string } }[]
}

// The OpenAI chat completions API. Groq serves the same API, so both are this one class.
class OpenAICompatibleProvider extends ChatProvider {
  constructor(readonly name: string, private baseUrl: string, private apiKey: string, model: string, fetchFn?: Fetch) {
    super(model, fetchFn)
  }

  private get auth() {
    return { Authorization: `Bearer ${this.apiKey}` }
  }

  async listModels(): Promise<string[]> {
    const body = (await this.request(`${this.baseUrl}/models`, { headers: this.auth })) as { data?: { id: string }[] }
    return (body.data ?? []).map((m) => m.id)
  }

  protected async send(prompt: string): Promise<string> {
    const body = (await this.postJson(
      `${this.baseUrl}/chat/completions`,
      // Low temperature: grading the same solution twice should give the same verdict
      { model: this.model, messages: [{ role: "user", content: prompt }], temperature: 0.1 },
      this.auth
    )) as ChatCompletion
    return body.choices?.[0]?.message?.content ?? "No response from AI."
  }
}

// Free tier, no billing needed. Key: https://console.groq.com
export class GroqProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string, model: string, fetchFn?: Fetch) {
    super("groq", "https://api.groq.com/openai/v1", apiKey, model, fetchFn)
  }
}

// Pay as you go; a ChatGPT plan does not include API access. Key: https://platform.openai.com
export class OpenAIProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string, model: string, fetchFn?: Fetch) {
    super("openai", "https://api.openai.com/v1", apiKey, model, fetchFn)
  }
}
