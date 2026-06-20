import { formatPort } from "./solution"

const cases: [number, string][] = [
  [8080, ":8080"],
  [443, ":443"],
  [3000, ":3000"],
  [80, ":80"],
]

let passed = 0
let failed = 0

for (const [input, expected] of cases) {
  const result = formatPort(input)
  if (result === expected) {
    passed++
  } else {
    console.error(`  FAIL: formatPort(${input}) → "${result}" (expected "${expected}")`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
