import * as fs from "fs"
import * as path from "path"
import * as https from "https"
import { AIProvider, EvalResult } from "./provider"

const AGENT_MD = path.join(__dirname, "../../agent.md")

function loadAgentMd(): string {
  if (fs.existsSync(AGENT_MD)) return fs.readFileSync(AGENT_MD, "utf-8")
  return ""
}

function post(url: string, body: string): Promise<string> {
  return new Promise((resolve, reject) => {
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
}

export class GeminiProvider implements AIProvider {
  private apiKey: string
  private model = "gemini-1.5-flash"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async call(prompt: string): Promise<string> {
    const agentContext = loadAgentMd()
    const fullPrompt = agentContext ? `${agentContext}\n\n---\n\n${prompt}` : prompt
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
    const body = JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
    const raw = await post(url, body)
    const json = JSON.parse(raw)
    return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from AI."
  }

  async evaluate(challengeDescription: string, solutionCode: string): Promise<EvalResult> {
    const prompt = `CHALLENGE:\n${challengeDescription}\n\nSOLUTION:\n${solutionCode}\n\nEvaluate the solution approach.`
    const response = await this.call(prompt)
    const pass = response.toUpperCase().startsWith("PASS")
    const feedback = response.replace(/^(PASS|FAIL)\s*/i, "").trim()
    return { pass, feedback }
  }

  async insight(challengeDescription: string, solutionCode: string, errorOutput: string): Promise<string> {
    const prompt = `CHALLENGE:\n${challengeDescription}\n\nSOLUTION:\n${solutionCode}\n\nERRORS:\n${errorOutput}\n\nGive a specific insight to help the user fix their approach.`
    return this.call(prompt)
  }
}
