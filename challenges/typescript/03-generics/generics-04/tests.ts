import { wrap } from "./solution"

let passed = 0
let failed = 0

function check<T>(input: T, expectedValue: T, label: string): void {
  const result = wrap(input)
  if (typeof result !== "object" || result === null || !("value" in result)) {
    console.error(`  FAIL [${label}]: result is not an object with 'value' property`)
    failed++
    return
  }
  if ((result as { value: unknown }).value !== expectedValue) {
    console.error(`  FAIL [${label}]: wrap(${JSON.stringify(input)}).value = ${JSON.stringify((result as any).value)}, expected ${JSON.stringify(expectedValue)}`)
    failed++
    return
  }
  passed++
}

check(42, 42, "number")
check("hello", "hello", "string")
check(true, true, "boolean")
check({ a: 1 }, { a: 1 }, "object")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
