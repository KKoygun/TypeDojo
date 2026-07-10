import { classify, clamp } from "./solution"

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

check("classify 5", classify(5), "positive")
check("classify -3", classify(-3), "negative")
check("classify 0", classify(0), "zero")
check("classify 100", classify(100), "positive")
check("classify -1", classify(-1), "negative")

check("clamp in range", clamp(5, 0, 10), 5)
check("clamp below min", clamp(-5, 0, 10), 0)
check("clamp above max", clamp(15, 0, 10), 10)
check("clamp at min", clamp(0, 0, 10), 0)
check("clamp at max", clamp(10, 0, 10), 10)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
