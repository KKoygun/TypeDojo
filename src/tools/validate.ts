// Proves the tests of every validated topic are meaningful:
//   (a) the reference solution in reference/<topic>/<id>.ts must compile and pass tests.ts
//   (b) the untouched template.ts must fail tests.ts, even with type checking off
// Each check runs in a scratch copy of the challenge folder under .validate/, so the
// learner's own solution.ts is never read or overwritten.
//
//   npm run validate                 all topics with status "validated"
//   npm run validate -- js-03 types-04   only these challenge ids
import * as fs from "fs"
import * as path from "path"
import { CHALLENGES_DIR, loadCurriculum, topicStatus } from "../curriculum"
import { compileCheck, passedCount, runTests } from "../runner/grader"
import { Challenge, TopicMeta } from "../types"

const ROOT = path.join(__dirname, "../..")
export const REFERENCE_DIR = path.join(ROOT, "reference")
const SCRATCH_DIR = path.join(ROOT, ".validate")

export interface ValidationResult {
  id: string
  ok: boolean
  problems: string[]
  testsPassed: number
}

export function referencePath(c: Challenge): string {
  return path.join(REFERENCE_DIR, c.topic, `${c.id}.ts`)
}

// Copy the challenge folder (tests.ts plus any helper files) without the learner's solution.ts
function makeSandbox(c: Challenge): string {
  const src = path.join(CHALLENGES_DIR, c.topic, c.id)
  const dest = path.join(SCRATCH_DIR, c.id)
  fs.rmSync(dest, { recursive: true, force: true })
  fs.mkdirSync(dest, { recursive: true })
  for (const name of fs.readdirSync(src)) {
    if (name === "solution.ts") continue
    fs.copyFileSync(path.join(src, name), path.join(dest, name))
  }
  return dest
}

function firstLine(output: string): string {
  return output.split("\n").map((l) => l.trim()).find(Boolean) ?? "(no output)"
}

export function validateChallenge(c: Challenge): ValidationResult {
  const result: ValidationResult = { id: c.id, ok: false, problems: [], testsPassed: 0 }
  const ref = referencePath(c)
  if (!fs.existsSync(ref)) {
    result.problems.push(`no reference solution at ${path.relative(ROOT, ref)}`)
    return result
  }

  const dir = makeSandbox(c)
  const solution = path.join(dir, "solution.ts")
  const tests = path.join(dir, "tests.ts")
  try {
    if (!fs.existsSync(tests)) {
      result.problems.push("no tests.ts")
      return result
    }

    // (a) reference must compile and pass
    fs.copyFileSync(ref, solution)
    const compiled = compileCheck(solution)
    if (!compiled.ok) {
      result.problems.push(`reference does not compile: ${firstLine(compiled.output)}`)
    } else {
      const run = runTests(tests, solution)
      result.testsPassed = passedCount(run.output)
      if (!run.ok) result.problems.push(`reference fails its tests: ${firstLine(run.output)}`)
      else if (result.testsPassed === 0) result.problems.push("reference run reported 0 passing tests")
    }

    // (b) template must fail, and must fail at runtime, not only because it does not type-check
    fs.copyFileSync(path.join(dir, "template.ts"), solution)
    const templateRun = runTests(tests, solution, { transpileOnly: true })
    if (templateRun.ok) result.problems.push("untouched template passes the tests — tests are vacuous")
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  result.ok = result.problems.length === 0
  return result
}

export function challengesToValidate(curriculum: TopicMeta[], ids: string[] = []): Challenge[] {
  const validated = curriculum.filter((t) => topicStatus(t) === "validated")
  const all = validated.flatMap((t) => t.challenges.filter((c) => c.type === "file"))
  if (ids.length === 0) return all
  const unknown = ids.filter((id) => !all.some((c) => c.id === id))
  if (unknown.length) throw new Error(`not a file challenge in a validated topic: ${unknown.join(", ")}`)
  return all.filter((c) => ids.includes(c.id))
}

function main(): void {
  const ids = process.argv.slice(2).filter((a) => !a.startsWith("-"))
  const challenges = challengesToValidate(loadCurriculum(), ids)
  console.log(`Validating ${challenges.length} file challenges in validated topics\n`)

  const failures: ValidationResult[] = []
  for (const c of challenges) {
    const r = validateChallenge(c)
    if (r.ok) {
      console.log(`  ok    ${c.id.padEnd(16)} reference passes ${r.testsPassed} tests, template fails`)
    } else {
      failures.push(r)
      console.log(`  FAIL  ${c.id}`)
      for (const p of r.problems) console.log(`          ${p}`)
    }
  }
  fs.rmSync(SCRATCH_DIR, { recursive: true, force: true })

  console.log(`\n${challenges.length - failures.length}/${challenges.length} challenges valid`)
  if (failures.length) process.exit(1)
}

if (require.main === module) main()
