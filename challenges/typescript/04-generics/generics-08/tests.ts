import { getProperty, pluck } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown): void {
  if (JSON.stringify(got) === JSON.stringify(expected)) {
    passed++
  } else {
    console.error(`  FAIL [${label}]: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`)
    failed++
  }
}

const obj = { name: "api", port: 8080, active: true }
check("getProperty name", getProperty(obj, "name"), "api")
check("getProperty port", getProperty(obj, "port"), 8080)
check("getProperty active", getProperty(obj, "active"), true)

const services = [
  { name: "api", port: 8080 },
  { name: "db", port: 5432 },
  { name: "cache", port: 6379 },
]
check("pluck names", pluck(services, "name"), ["api", "db", "cache"])
check("pluck ports", pluck(services, "port"), [8080, 5432, 6379])
check("pluck empty", pluck([], "name"), [])

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
