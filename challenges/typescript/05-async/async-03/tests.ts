import { safeDivide, trySafeDivide } from "./solution"

let passed = 0
let failed = 0

async function run() {
  const r1 = await safeDivide(10, 2)
  if (r1 === 5) { passed++ } else { console.error(`  FAIL [safeDivide 10/2]: ${r1}`); failed++ }

  const r2 = await safeDivide(7, 2)
  if (r2 === 3.5) { passed++ } else { console.error(`  FAIL [safeDivide 7/2]: ${r2}`); failed++ }

  let threw = false
  try { await safeDivide(5, 0) } catch (e) {
    threw = e instanceof Error && e.message === "Cannot divide by zero"
  }
  if (threw) { passed++ } else { console.error("  FAIL [safeDivide zero]: did not throw correct error"); failed++ }

  const s1 = await trySafeDivide(10, 2)
  if (s1 === "Result: 5") { passed++ } else { console.error(`  FAIL [trySafeDivide success]: "${s1}"`); failed++ }

  const s2 = await trySafeDivide(5, 0)
  if (s2 === "Error: Cannot divide by zero") { passed++ } else { console.error(`  FAIL [trySafeDivide fail]: "${s2}"`); failed++ }

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

run()
