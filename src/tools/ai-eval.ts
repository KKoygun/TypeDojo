// Measures how often the AI approach evaluation agrees with a hand-labelled golden set.
//   npm run ai:eval                 replay saved responses (offline, no key) and report agreement
//   npm run ai:eval -- --check      no AI: prove every case compiles and passes its runtime tests
//   npm run ai:record               call the real model, save responses, report agreement (needs GEMINI_API_KEY)
//   npm run ai:eval -- --live       call the real model without saving anything
import * as dotenv from "dotenv"
import * as fs from "fs"
import * as path from "path"
import { AIMode, createProvider, DEFAULT_CASSETTE_DIR } from "../ai"
import { ReplayProvider } from "../ai/recording"
import { evaluatePrompt, Tutor } from "../ai/tutor"
import { loadCurriculum, topicStatus } from "../curriculum"
import { compileCheck, runTests } from "../runner/grader"
import { Challenge } from "../types"
import { makeSandbox, SCRATCH_DIR } from "./validate"

const EVAL_DIR = path.join(__dirname, "../../evals/approach")

export interface GoldenCase {
  name: string
  challenge: string
  expected: "PASS" | "FAIL"
  reason: string
}

export function loadGoldenSet(): GoldenCase[] {
  return JSON.parse(fs.readFileSync(path.join(EVAL_DIR, "golden.json"), "utf-8")).cases
}

export function caseFile(c: GoldenCase): string {
  return path.join(EVAL_DIR, "cases", `${c.name}.ts`)
}

function findChallenge(id: string): Challenge {
  const topics = loadCurriculum().filter((t) => topicStatus(t) === "validated")
  const found = topics.flatMap((t) => t.challenges).find((c) => c.id === id)
  if (!found) throw new Error(`golden case refers to ${id}, which is not a challenge in a validated topic`)
  return found
}

export interface Row {
  name: string
  expected: "PASS" | "FAIL"
  got: "PASS" | "FAIL" | "missing"
}

export function score(rows: Row[]) {
  const scored = rows.filter((r) => r.got !== "missing")
  return {
    scored: scored.length,
    agree: scored.filter((r) => r.got === r.expected).length,
    falsePass: scored.filter((r) => r.expected === "FAIL" && r.got === "PASS").length,
    falseFail: scored.filter((r) => r.expected === "PASS" && r.got === "FAIL").length,
    missing: rows.length - scored.length,
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// The golden set only means something if the bad cases slip past the runtime tests
function checkPremise(cases: GoldenCase[]): number {
  let broken = 0
  for (const g of cases) {
    const dir = makeSandbox(findChallenge(g.challenge))
    try {
      const solution = path.join(dir, "solution.ts")
      fs.copyFileSync(caseFile(g), solution)
      const compiled = compileCheck(solution)
      const tests = compiled.ok ? runTests(path.join(dir, "tests.ts"), solution) : compiled
      if (tests.ok) console.log(`  ok    ${g.name}`)
      else {
        broken++
        console.log(`  FAIL  ${g.name} does not pass its runtime tests:\n${tests.output}`)
      }
    } finally {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  }
  fs.rmSync(SCRATCH_DIR, { recursive: true, force: true })
  return broken
}

async function evaluate(cases: GoldenCase[], mode: AIMode, delayMs: number): Promise<number> {
  const provider = createProvider(mode)
  if (!provider) {
    console.error("GEMINI_API_KEY is not set. Add it to .env to record or run live.")
    return 1
  }
  const tutor = new Tutor(provider)
  const rows: Row[] = []

  for (const [i, g] of cases.entries()) {
    const description = findChallenge(g.challenge).description
    const code = fs.readFileSync(caseFile(g), "utf-8")
    if (provider instanceof ReplayProvider && !provider.has(evaluatePrompt(description, code))) {
      rows.push({ name: g.name, expected: g.expected, got: "missing" })
      continue
    }
    if (mode !== "replay" && i > 0) await sleep(delayMs) // stay under free-tier rate limits
    const result = await tutor.evaluate(description, code)
    rows.push({ name: g.name, expected: g.expected, got: result.pass ? "PASS" : "FAIL" })
  }

  for (const r of rows) {
    const mark = r.got === "missing" ? "  ?  " : r.got === r.expected ? "  =  " : "  x  "
    console.log(`${mark}${r.name.padEnd(40)} expected ${r.expected}  got ${r.got}`)
  }

  const { scored, agree, falsePass, falseFail, missing } = score(rows)

  console.log()
  if (scored) {
    console.log(`Agreement: ${agree}/${scored} (${Math.round((agree / scored) * 100)}%)`)
    console.log(`Bad solutions the AI let through: ${falsePass} · good solutions it rejected: ${falseFail}`)
  }
  if (missing) {
    console.log(`${missing}/${rows.length} cases have no recorded response for the current prompts. Run: npm run ai:record`)
    return 1
  }
  return 0
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const cases = loadGoldenSet()
  if (args.includes("--check")) {
    console.log(`Checking that all ${cases.length} golden cases pass their runtime tests\n`)
    const broken = checkPremise(cases)
    console.log(`\n${cases.length - broken}/${cases.length} cases pass their runtime tests`)
    process.exit(broken ? 1 : 0)
  }

  const mode: AIMode = args.includes("--record") ? "record" : args.includes("--live") ? "live" : "replay"
  if (mode !== "replay") dotenv.config({ quiet: true })
  const delayArg = args.find((a) => a.startsWith("--delay-ms="))
  const delayMs = delayArg ? Number(delayArg.split("=")[1]) : 4500

  console.log(`AI approach eval · ${cases.length} cases · mode: ${mode}` +
    (mode === "replay" ? ` (recordings in ${path.relative(process.cwd(), DEFAULT_CASSETTE_DIR)})` : "") + "\n")
  process.exit(await evaluate(cases, mode, delayMs))
}

if (require.main === module) main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
