import { assert, test, suite, printSuite } from "./solution"

let passed = 0; let failed = 0
function check(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function checkThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (no throw)`); failed++ } catch { passed++ }
}

// assert
checkThrows(() => assert(1, 2), "assert throws on mismatch")
checkThrows(() => assert("a", "b", "label"), "assert throws with label")
try { assert(1, 1); passed++ } catch { console.error("  FAIL: assert passes on match"); failed++ }
try { assert("x", "x"); passed++ } catch { console.error("  FAIL: assert passes on string match"); failed++ }

async function main() {
  // test()
  const passing = await test("passes", async () => { assert(1, 1) })
  check(passing.passed === true, "test passes when no error")
  check(typeof passing.durationMs === "number", "test records duration")
  check(passing.name === "passes", "test records name")

  const failing = await test("fails", () => { throw new Error("oops") })
  check(failing.passed === false, "test fails on throw")
  check(failing.error === "oops", "test records error message")

  // suite()
  const result = await suite("my-suite", {
    "test one": () => assert(1, 1),
    "test two": () => { throw new Error("wrong") },
    "test three": async () => assert("a", "a"),
  })
  check(result.suite === "my-suite", "suite name")
  check(result.results.length === 3, "suite has 3 results")
  check(result.passed === 2, "suite 2 passed")
  check(result.failed === 1, "suite 1 failed")
  check(typeof result.totalMs === "number", "suite totalMs")

  // printSuite — just verify it doesn't throw and writes something
  const lines: string[] = []
  const orig = process.stdout.write.bind(process.stdout)
  ;(process.stdout as any).write = (s: string) => { lines.push(s); return true }
  printSuite(result)
  ;(process.stdout as any).write = orig
  check(lines.join("").includes("my-suite"), "printSuite includes suite name")
  check(lines.join("").includes("test one"), "printSuite includes test name")

  if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
  else console.log(`  ${passed} test(s) passed`)
}

main()
