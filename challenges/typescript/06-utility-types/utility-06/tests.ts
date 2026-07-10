import { withDefaults } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown): void {
  if (got === expected) {
    passed++
  } else {
    console.error(`  FAIL [${label}]: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`)
    failed++
  }
}

const all = withDefaults({})
check("timeout default", all.timeout, 5000)
check("retries default", all.retries, 3)
check("baseUrl default", all.baseUrl, "http://localhost")
check("debug default", all.debug, false)

const partial = withDefaults({ timeout: 1000, debug: true })
check("timeout override", partial.timeout, 1000)
check("retries still default", partial.retries, 3)
check("debug override", partial.debug, true)
check("baseUrl still default", partial.baseUrl, "http://localhost")

const full = withDefaults({ timeout: 500, retries: 5, baseUrl: "https://api.example.com", debug: true })
check("full timeout", full.timeout, 500)
check("full retries", full.retries, 5)
check("full baseUrl", full.baseUrl, "https://api.example.com")
check("full debug", full.debug, true)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
