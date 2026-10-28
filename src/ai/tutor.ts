import * as fs from "fs"
import * as path from "path"
import { AIProvider, EvalResult } from "./provider"

// Points at src/ai/prompts whether this runs from src/ai (ts-node) or dist/ai (tsc build)
const PROMPTS_DIR = path.join(__dirname, "../../src/ai/prompts")

export function loadPrompt(name: "evaluate" | "ask"): string {
  const file = path.join(PROMPTS_DIR, `${name}.md`)
  // A missing evaluator prompt would quietly change how solutions are graded, so fail loudly
  if (!fs.existsSync(file)) throw new Error(`AI prompt not found: ${file}`)
  return fs.readFileSync(file, "utf-8")
}

// The evaluator is told to start with PASS or FAIL. Models sometimes wrap it in
// markdown (**PASS**), so strip leading formatting before reading the verdict.
export function parseVerdict(response: string): EvalResult {
  const text = response.trim().replace(/^[*_#>`\s]+/, "")
  const pass = /^PASS\b/i.test(text)
  const feedback = text.replace(/^(PASS|FAIL)\b[*_`:.\s-]*/i, "").trim()
  return { pass, feedback }
}

export function evaluatePrompt(challengeDescription: string, solutionCode: string): string {
  return `${loadPrompt("evaluate")}\n\n---\n\nCHALLENGE:\n${challengeDescription}\n\nSOLUTION:\n${solutionCode}\n\nEvaluate the solution approach.`
}

export function insightPrompt(challengeDescription: string, solutionCode: string, errorOutput: string): string {
  return `You are a TypeScript tutor. A student is stuck on this challenge:

CHALLENGE:
${challengeDescription}

Their current code:
${solutionCode}

Error they got:
${errorOutput}

Give 2-3 sentences of specific, actionable guidance. Point at what TypeScript concept they need to apply and how. Do not solve it for them — guide them toward the solution.`
}

export function askPrompt(question: string, code?: string, challengeDescription?: string): string {
  const codeContext = code?.trim() ? `\n\nMy current solution:\n\`\`\`typescript\n${code.trim()}\n\`\`\`` : ""
  const challengeContext = challengeDescription?.trim()
    ? `\n\nThe student is working on this challenge — do NOT solve it or show the implementation:\n${challengeDescription.trim()}`
    : ""
  return `${loadPrompt("ask")}${challengeContext}\n\n---\n\n${question}${codeContext}`
}

// What the app asks the AI for. Knows nothing about which model answers.
export class Tutor {
  constructor(readonly provider: AIProvider) {}

  async evaluate(challengeDescription: string, solutionCode: string): Promise<EvalResult> {
    return parseVerdict(await this.provider.generate(evaluatePrompt(challengeDescription, solutionCode)))
  }

  insight(challengeDescription: string, solutionCode: string, errorOutput: string): Promise<string> {
    return this.provider.generate(insightPrompt(challengeDescription, solutionCode, errorOutput))
  }

  ask(question: string, code?: string, challengeDescription?: string): Promise<string> {
    return this.provider.generate(askPrompt(question, code, challengeDescription))
  }
}
