import { wrap, unwrap } from "./solution"

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

const w1 = wrap(42)
check("wrap has value", "value" in w1, true)
check("wrap number", w1.value, 42)

const w2 = wrap("hello")
check("wrap string", w2.value, "hello")

const w3 = wrap(true)
check("wrap boolean", w3.value, true)

check("unwrap number", unwrap(wrap(99)), 99)
check("unwrap string", unwrap(wrap("world")), "world")
check("unwrap null", unwrap(wrap(null)), null)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
