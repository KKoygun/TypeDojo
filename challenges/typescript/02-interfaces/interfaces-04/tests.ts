import { ServiceConfig, buildUrl } from "./solution"

const cases: [ServiceConfig, string][] = [
  [{ host: "localhost", port: 8080 }, "http://localhost:8080"],
  [{ host: "api.example.com", port: 443 }, "http://api.example.com:443"],
  [{ host: "db", port: 5432, timeout: 3000 }, "http://db:5432"],
  [{ host: "cache", port: 6379, timeout: 1000, retries: 3 }, "http://cache:6379"],
]

let passed = 0
let failed = 0

for (const [input, expected] of cases) {
  const result = buildUrl(input)
  if (result === expected) {
    passed++
  } else {
    console.error(`  FAIL: buildUrl(${JSON.stringify(input)}) → "${result}" (expected "${expected}")`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
