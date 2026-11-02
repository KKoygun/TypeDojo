import { ChatProvider, Fetch } from "./base"

// A model running on your own machine (https://ollama.com): no key, nothing leaves the computer.
//   ollama pull <model> && ollama serve
export class OllamaProvider extends ChatProvider {
  readonly name = "ollama"
  private host: string

  constructor(model: string, host = "http://localhost:11434", fetchFn?: Fetch) {
    super(model, fetchFn)
    // OLLAMA_HOST is often written without a scheme, e.g. 127.0.0.1:11434
    this.host = (host.includes("://") ? host : `http://${host}`).replace(/\/$/, "")
  }

  async listModels(): Promise<string[]> {
    const body = (await this.call(`${this.host}/api/tags`)) as { models?: { name: string }[] }
    return (body.models ?? []).map((m) => m.name)
  }

  protected async send(prompt: string): Promise<string> {
    const body = (await this.call(`${this.host}/api/chat`, {
      model: this.model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
      options: { temperature: 0.1 },
    })) as { message?: { content?: string } }
    return body.message?.content ?? "No response from AI."
  }

  private async call(url: string, body?: unknown): Promise<unknown> {
    try {
      return body === undefined ? await this.request(url) : await this.postJson(url, body)
    } catch (e) {
      // fetch throws a TypeError when nothing is listening on the port
      if (e instanceof TypeError) throw new Error(`Could not reach Ollama at ${this.host}. Is "ollama serve" running?`)
      throw e
    }
  }
}
