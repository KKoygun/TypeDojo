import { stringify } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown) {
  if (got === expected) { console.log(`  PASS  ${label}`); passed++ }
  else { console.error(`  FAIL  ${label}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`); failed++ }
}

check("stringify(\"hello\")", stringify("hello"), "hello")
check("stringify(\"\")",      stringify(""),      "")
check("stringify(3)",         stringify(3),       "3.00")
check("stringify(3.5)",       stringify(3.5),     "3.50")
check("stringify(0)",         stringify(0),       "0.00")
check("stringify(true)",      stringify(true),    "yes")
check("stringify(false)",     stringify(false),   "no")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`\n  ${passed} test(s) passed`)
