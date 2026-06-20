import { stringify } from "./solution"

const cases: [string | number | boolean, string][] = [
  ["hello", "hello"],
  ["", ""],
  [3, "3.00"],
  [3.5, "3.50"],
  [0, "0.00"],
  [true, "yes"],
  [false, "no"],
]

let passed = 0
let failed = 0

for (const [input, expected] of cases) {
  const result = stringify(input)
  if (result === expected) {
    passed++
  } else {
    console.error(`  FAIL: stringify(${JSON.stringify(input)}) → "${result}" (expected "${expected}")`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
