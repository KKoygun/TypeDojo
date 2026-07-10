import { describeValue } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown) {
  if (got === expected) { console.log(`  PASS  ${label}`); passed++ }
  else { console.error(`  FAIL  ${label}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`); failed++ }
}

check("string",        describeValue("hello"),   "string of length 5")
check("empty string",  describeValue(""),        "string of length 0")
check("number",        describeValue(42),        "number: 42")
check("boolean true",  describeValue(true),      "boolean: true")
check("boolean false", describeValue(false),     "boolean: false")
check("array",         describeValue([1, 2]),    "array of length 2")
check("empty array",   describeValue([]),        "array of length 0")
check("object",        describeValue({}),        "object")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`\n  ${passed} test(s) passed`)
