import { greet } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown) {
  if (got === expected) { console.log(`  PASS  ${label}`); passed++ }
  else { console.error(`  FAIL  ${label}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`); failed++ }
}

check("greet(\"Alice\")",           greet("Alice"),          "Hello, Alice")
check("greet(\"Alice\", \"Dr.\")",  greet("Alice", "Dr."),   "Hello, Dr. Alice")
check("greet(\"Bob\")",             greet("Bob"),            "Hello, Bob")
check("greet(\"Bob\", \"Prof.\")",  greet("Bob", "Prof."),   "Hello, Prof. Bob")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`\n  ${passed} test(s) passed`)
