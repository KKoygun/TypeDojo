import { typeOf, isString } from "./solution"

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

check("typeof string", typeOf("hello"), "string")
check("typeof number", typeOf(42), "number")
check("typeof boolean", typeOf(true), "boolean")
check("typeof undefined", typeOf(undefined), "undefined")
check("typeof null", typeOf(null), "object")
check("typeof function", typeOf(() => {}), "function")

check("isString true", isString("hello"), true)
check("isString false for number", isString(42), false)
check("isString false for null", isString(null), false)
check("isString false for array", isString([]), false)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
