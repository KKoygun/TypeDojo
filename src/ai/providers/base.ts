import { AIProvider } from "../provider"

export type Fetch = typeof fetch

// An HTTP error that keeps its status, so ChatProvider can turn a 404 into "no such model"
export class ProviderHttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

// Shared by every backend: the model check and the error messages live here once,
// each provider only implements send() and listModels().
// There is no default model. AI_MODEL is sent exactly as written; if the provider
// does not have it, the call fails and says how to find one that exists.
export abstract class ChatProvider implements AIProvider {
  abstract readonly name: string

  constructor(readonly model: string, protected readonly fetchFn: Fetch = fetch) {}

  protected abstract send(prompt: string): Promise<string>

  // Model ids this key can use, for npm run models
  abstract listModels(): Promise<string[]>

  async generate(prompt: string): Promise<string> {
    if (!this.model) throw new Error(`AI_MODEL is not set. Run "npm run models" to see which ${this.name} models you can use.`)
    try {
      return await this.send(prompt)
    } catch (e) {
      if (e instanceof ProviderHttpError && e.status === 404) {
        throw new ProviderHttpError(404, `${this.name} has no model "${this.model}" for this key. Run "npm run models" and set AI_MODEL to one of them.`)
      }
      throw e
    }
  }

  protected async request(url: string, init: RequestInit = {}): Promise<unknown> {
    const response = await this.fetchFn(url, init)
    const text = await response.text()
    if (!response.ok) throw new ProviderHttpError(response.status, `${this.name} returned ${response.status}: ${text.slice(0, 300)}`)
    return text ? JSON.parse(text) : {}
  }

  protected postJson(url: string, body: unknown, headers: Record<string, string> = {}): Promise<unknown> {
    return this.request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    })
  }
}
