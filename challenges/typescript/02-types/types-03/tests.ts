import { formatPort } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown) {
  if (got === expected) { console.log(`  PASS  ${label}`); passed++ }
  else { console.error(`  FAIL  ${label}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`); failed++ }
}

check("formatPort(8080)", formatPort(8080), ":8080")
check("formatPort(3000)", formatPort(3000), ":3000")
check("formatPort(443)",  formatPort(443),  ":443")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`\n  ${passed} test(s) passed`)
