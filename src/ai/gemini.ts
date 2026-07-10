import * as fs from "fs"
import * as path from "path"
import * as https from "https"
import { AIProvider, EvalResult } from "./provider"

const AGENT_MD = path.join(__dirname, "../../agent.md")
const ASK_MD = path.join(__dirname, "../../ask.md")

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
  private model = "gemini-3.1-flash-lite"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async call(prompt: string, useAgentMd = true): Promise<string> {
    const agentContext = useAgentMd ? loadAgentMd() : ""
    const fullPrompt = agentContext ? `${agentContext}\n\n---\n\n${prompt}` : prompt
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
    const body = JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
    const raw = await post(url, body)
    const json = JSON.parse(raw)
    if (json?.error) throw new Error(`Gemini API error ${json.error.code}: ${json.error.message}`)
    return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from AI."
  }

  async evaluate(challengeDescription: string, solutionCode: string): Promise<EvalResult> {
    const prompt = `CHALLENGE:\n${challengeDescription}\n\nSOLUTION:\n${solutionCode}\n\nEvaluate the solution approach.`
    const response = await this.call(prompt, true)
    const pass = response.toUpperCase().startsWith("PASS")
    const feedback = response.replace(/^(PASS|FAIL)\s*/i, "").trim()
    return { pass, feedback }
  }

  async ask(question: string, code?: string, challengeDescription?: string): Promise<string> {
    const systemPrompt = fs.existsSync(ASK_MD) ? fs.readFileSync(ASK_MD, "utf-8") : ""
    const codeContext = code?.trim() ? `\n\nMy current solution:\n\`\`\`typescript\n${code.trim()}\n\`\`\`` : ""
    const challengeContext = challengeDescription?.trim()
      ? `\n\nThe student is working on this challenge — do NOT solve it or show the implementation:\n${challengeDescription.trim()}`
      : ""
    const prompt = systemPrompt
      ? `${systemPrompt}${challengeContext}\n\n---\n\n${question}${codeContext}`
      : `${question}${codeContext}`
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
    const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    const raw = await post(url, body)
    const json = JSON.parse(raw)
    if (json?.error) throw new Error(`Gemini API error ${json.error.code}: ${json.error.message}`)
    return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response from AI."
  }

  async insight(challengeDescription: string, solutionCode: string, errorOutput: string): Promise<string> {
    const prompt = `You are a TypeScript tutor. A student is stuck on this challenge:

CHALLENGE:
${challengeDescription}

Their current code:
${solutionCode}

Error they got:
${errorOutput}

Give 2-3 sentences of specific, actionable guidance. Point at what TypeScript concept they need to apply and how. Do not solve it for them — guide them toward the solution.`
    return this.call(prompt, false)
  }
}
