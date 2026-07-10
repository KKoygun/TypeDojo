import { createServer, restart } from "./solution"

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

const s = createServer("localhost", 8080, false)
check("createServer host", s.host, "localhost")
check("createServer port", s.port, 8080)
check("createServer debug", s.debug, false)
check("createServer start", s.start(), "started")

const s2 = restart(s, ["api.example.com", 443, true])
check("restart host", s2.host, "api.example.com")
check("restart port", s2.port, 443)
check("restart debug", s2.debug, true)
check("restart start", s2.start(), "started")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
