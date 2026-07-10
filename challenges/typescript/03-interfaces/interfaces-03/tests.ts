import { formatConfig } from "./solution"

const cases: [Parameters<typeof formatConfig>[0], string][] = [
  [{ name: "api", version: "1.0", port: 8080 }, "api v1.0 on port 8080"],
  [{ name: "db-proxy", version: "2.3", port: 5432 }, "db-proxy v2.3 on port 5432"],
  [{ name: "cache", version: "0.9", port: 6379 }, "cache v0.9 on port 6379"],
]

let passed = 0
let failed = 0

for (const [input, expected] of cases) {
  const result = formatConfig(input)
  if (result === expected) {
    passed++
  } else {
    console.error(`  FAIL: formatConfig(${JSON.stringify(input)}) → "${result}" (expected "${expected}")`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
