import { formatId } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown) {
  if (got === expected) { console.log(`  PASS  ${label}`); passed++ }
  else { console.error(`  FAIL  ${label}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`); failed++ }
}

check("formatId(42)",      formatId(42),    "42")
check("formatId(\"abc\")", formatId("abc"), "abc")
check("formatId(0)",       formatId(0),     "0")
check("formatId(\"\")",    formatId(""),    "")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`\n  ${passed} test(s) passed`)
