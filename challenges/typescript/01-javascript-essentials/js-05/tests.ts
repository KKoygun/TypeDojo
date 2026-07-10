import { makeMultiplier, makeToggle } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown): void {
  if (got === expected) {
    passed++
  } else {
    console.error(`  FAIL [${label}]: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`)
    failed++
  }
}

check("makeMultiplier(2)(5)", makeMultiplier(2)(5), 10)
check("makeMultiplier(3)(4)", makeMultiplier(3)(4), 12)
check("makeMultiplier(1)(7)", makeMultiplier(1)(7), 7)
check("makeMultiplier(0)(100)", makeMultiplier(0)(100), 0)

const triple = makeMultiplier(3)
check("triple(0)", triple(0), 0)
check("triple(10)", triple(10), 30)

const t1 = makeToggle(false)
check("makeToggle(false) first call → true", t1(), true)
check("second call → false", t1(), false)
check("third call → true again", t1(), true)

const t2 = makeToggle(true)
check("makeToggle(true) first call → false", t2(), false)
check("second call → true", t2(), true)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
