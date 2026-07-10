import { createCounter } from "./solution"

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

const c = createCounter()
check("initial value", c.value(), 0)
c.increment()
c.increment()
check("after 2 increments", c.value(), 2)
c.decrement()
check("after decrement", c.value(), 1)
c.reset()
check("after reset", c.value(), 0)

const c2 = createCounter(10)
check("initial with seed", c2.value(), 10)
c2.increment()
check("increment from seed", c2.value(), 11)
c2.reset()
check("reset returns to 10", c2.value(), 10)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
