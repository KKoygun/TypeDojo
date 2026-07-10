import { repeat, countdown } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown): void {
  if (JSON.stringify(got) === JSON.stringify(expected)) {
    passed++
  } else {
    console.error(`  FAIL [${label}]: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`)
    failed++
  }
}

check("repeat 'ha' 3 times", repeat("ha", 3), "hahaha")
check("repeat 'ab' 1 time", repeat("ab", 1), "ab")
check("repeat 0 times", repeat("x", 0), "")
check("repeat empty string 5 times", repeat("", 5), "")

check("countdown from 3", countdown(3), [3, 2, 1, 0])
check("countdown from 0", countdown(0), [0])
check("countdown from 1", countdown(1), [1, 0])
check("countdown from 5", countdown(5), [5, 4, 3, 2, 1, 0])

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
