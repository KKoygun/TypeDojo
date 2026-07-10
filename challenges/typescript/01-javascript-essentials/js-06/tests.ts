import { double, square } from "./solution"

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

check("double 5", double(5), 10)
check("double 0", double(0), 0)
check("double -3", double(-3), -6)
check("double 2.5", double(2.5), 5)

check("square 4", square(4), 16)
check("square 3", square(3), 9)
check("square 0", square(0), 0)
check("square -2", square(-2), 4)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
