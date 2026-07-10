import { tryCatch, runAll, countResults } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

async function main() {
  const ok = await tryCatch(async () => 42)
  assert(ok.ok === true, "tryCatch success ok=true")
  assert(ok.ok && ok.value === 42, "tryCatch success value=42")

  const fail = await tryCatch(async () => { throw new Error("boom") })
  assert(fail.ok === false, "tryCatch failure ok=false")
  assert(!fail.ok && fail.error === "boom", "tryCatch failure error message")

  const results = await runAll([
    async () => "a",
    async () => { throw new Error("fail") },
    async () => "c",
  ])
  assert(results.length === 3, "runAll returns all results")
  assert(results[0]?.ok === true, "runAll first ok")
  assert(results[1]?.ok === false, "runAll second failed")
  assert(results[2]?.ok === true, "runAll third ok")

  const counts = countResults(results)
  assert(counts.passed === 2, "countResults passed=2")
  assert(counts.failed === 1, "countResults failed=1")

  if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
  else console.log(`  ${passed} test(s) passed`)
}

main()
