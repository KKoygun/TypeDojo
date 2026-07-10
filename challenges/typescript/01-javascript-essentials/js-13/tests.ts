import { divide, safeDivide } from "./solution"

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

check("divide 10 / 2", divide(10, 2), 5)
check("divide 9 / 3", divide(9, 3), 3)
check("divide 7 / 2", divide(7, 2), 3.5)

let threw = false
try {
  divide(5, 0)
} catch (err) {
  threw = true
  if (err instanceof Error) {
    check("divide by zero message", err.message, "Division by zero")
  }
}
if (!threw) {
  console.error("  FAIL [divide by zero]: expected an error to be thrown")
  failed++
} else {
  passed++
}

check("safeDivide 10 / 2", safeDivide(10, 2), 5)
check("safeDivide by zero", safeDivide(5, 0), 0)
check("safeDivide 0 / 5", safeDivide(0, 5), 0)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
