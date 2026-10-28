import { test, describe, after } from "node:test"
import assert from "node:assert/strict"
import * as path from "path"
import { compileCheck, runTests, passedCount, cleanError } from "../src/runner/grader"
import { scratchDir, removeDir, writeFiles } from "./helpers"

// Same shape as a real challenge: tests.ts imports from ./solution and exits 1 on failure
const TESTS = `import { add } from "./solution"
let passed = 0
let failed = 0
function check(label: string, got: unknown, expected: unknown) {
  if (got === expected) passed++
  else { console.error(\`  FAIL [\${label}]: got \${got}, expected \${expected}\`); failed++ }
}
check("add 1 2", add(1, 2), 3)
check("add -1 1", add(-1, 1), 0)
if (failed > 0) { console.error(\`\\n  \${failed} test(s) failed\`); process.exit(1) }
else console.log(\`  \${passed} test(s) passed\`)
`

function challenge(solution: string): { dir: string; solution: string; tests: string } {
  const dir = scratchDir("grader")
  writeFiles(dir, { "tests.ts": TESTS, "solution.ts": solution })
  return { dir, solution: path.join(dir, "solution.ts"), tests: path.join(dir, "tests.ts") }
}

describe("grader", () => {
  const dirs: string[] = []
  after(() => dirs.forEach(removeDir))
  const make = (solution: string) => {
    const c = challenge(solution)
    dirs.push(c.dir)
    return c
  }

  test("compileCheck passes valid TypeScript", () => {
    const c = make("export function add(a: number, b: number): number { return a + b }\n")
    assert.equal(compileCheck(c.solution).ok, true)
  })

  test("compileCheck fails on a type error and reports the TS error", () => {
    const c = make("export function add(a: number, b: number): string { return a + b }\n")
    const result = compileCheck(c.solution)
    assert.equal(result.ok, false)
    assert.match(result.output, /TS\d+/)
  })

  test("runTests passes a correct solution and reports the count", () => {
    const c = make("export function add(a: number, b: number): number { return a + b }\n")
    const result = runTests(c.tests, c.solution)
    assert.equal(result.ok, true)
    assert.equal(passedCount(result.output), 2)
  })

  test("runTests fails a wrong solution and shows which check failed", () => {
    const c = make("export function add(a: number, b: number): number { return a - b }\n")
    const result = runTests(c.tests, c.solution)
    assert.equal(result.ok, false)
    assert.match(result.output, /FAIL \[add 1 2\]/)
  })

  test("transpileOnly runs code that would not type-check", () => {
    // Missing return type annotation is fine; the body is the problem being graded
    const c = make("export function add(a, b) { return a + b }\n")
    assert.equal(runTests(c.tests, c.solution).ok, false, "type check should reject implicit any")
    assert.equal(runTests(c.tests, c.solution, { transpileOnly: true }).ok, true)
  })
})

describe("output helpers", () => {
  test("passedCount reads the summary line and defaults to 0", () => {
    assert.equal(passedCount("  12 test(s) passed"), 12)
    assert.equal(passedCount("nothing here"), 0)
  })

  test("cleanError keeps only TypeScript error lines", () => {
    const raw = "noise\nsolution.ts(1,1): error TS2322: Type 'number' is not assignable\nmore noise"
    assert.equal(cleanError(raw), "  solution.ts(1,1): error TS2322: Type 'number' is not assignable")
  })
})
