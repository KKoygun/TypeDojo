import { describeType, withFallback } from "./solution"

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

check("describeType string", describeType("hello"), "string")
check("describeType number", describeType(42), "number")
check("describeType boolean", describeType(true), "boolean")
check("describeType null", describeType(null), "null")
check("describeType undefined", describeType(undefined), "undefined")
check("describeType array", describeType([1, 2, 3]), "array")
check("describeType object", describeType({ a: 1 }), "object")

check("withFallback value exists", withFallback("hello", "default"), "hello")
check("withFallback null uses default", withFallback(null, "default"), "default")
check("withFallback undefined uses default", withFallback(undefined, "default"), "default")
check("withFallback zero is not null", withFallback(0, 99), 0)
check("withFallback empty string is not null", withFallback("", "default"), "")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
