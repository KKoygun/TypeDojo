import { safeLength } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown) {
  if (got === expected) { console.log(`  PASS  ${label}`); passed++ }
  else { console.error(`  FAIL  ${label}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`); failed++ }
}

check("safeLength(\"hello\")",  safeLength("hello"),    5)
check("safeLength(\"\")",       safeLength(""),         0)
check("safeLength([1,2,3])",    safeLength([1, 2, 3]),  3)
check("safeLength([])",         safeLength([]),         0)
check("safeLength(42)",         safeLength(42),         0)
check("safeLength(null)",       safeLength(null),       0)
check("safeLength(true)",       safeLength(true),       0)

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`\n  ${passed} test(s) passed`)
