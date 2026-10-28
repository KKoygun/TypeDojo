import * as https from "https"
import { AIProvider } from "../provider"

export const GEMINI_MODEL = "gemini-3.1-flash-lite"

export type HttpPost = (url: string, body: string) => Promise<string>

const httpsPost: HttpPost = (url, body) =>
  new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const req = https.request(
      { hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        let data = ""
        res.on("data", (c) => (data += c))
        res.on("end", () => resolve(data))
      }
    )
    req.on("error", reject)
    req.write(body)
    req.end()
  })

export class GeminiProvider implements AIProvider {
  readonly name = "gemini"
  readonly model = GEMINI_MODEL

  // post is injectable so tests can check the request without a network call
  constructor(private apiKey: string, private post: HttpPost = httpsPost) {}

  async generate(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
    const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    const raw = await this.post(url, body)
    const json = JSON.parse(raw)
    if (json?.error) throw new Error(`Gemini API error ${json.error.code}: ${json.error.message}`)
    return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from AI."
  }
}
