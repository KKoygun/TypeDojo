import { isAdult, canAccess, categorize } from "./solution"

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

check("isAdult 18", isAdult(18), true)
check("isAdult 21", isAdult(21), true)
check("isAdult 17", isAdult(17), false)
check("isAdult 0", isAdult(0), false)

check("canAccess adult with ticket", canAccess(20, true, false), true)
check("canAccess adult no ticket", canAccess(20, false, false), false)
check("canAccess VIP minor", canAccess(16, false, true), true)
check("canAccess VIP adult no ticket", canAccess(20, false, true), true)
check("canAccess minor with ticket no VIP", canAccess(16, true, false), false)

check("categorize 4 → positive even", categorize(4), "positive even")
check("categorize 7 → positive odd", categorize(7), "positive odd")
check("categorize -2 → negative even", categorize(-2), "negative even")
check("categorize -3 → negative odd", categorize(-3), "negative odd")
check("categorize 0 → zero", categorize(0), "zero")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
