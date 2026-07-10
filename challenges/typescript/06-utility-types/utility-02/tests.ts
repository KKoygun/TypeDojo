import { updateConfig } from "./solution"

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

const base = { host: "localhost", port: 8080, maxConnections: 100, debug: false }

const r1 = updateConfig(base, { port: 9090 })
check("port updated", r1.port, 9090)
check("host preserved", r1.host, "localhost")
check("maxConnections preserved", r1.maxConnections, 100)
check("debug preserved", r1.debug, false)

const r2 = updateConfig(base, { debug: true, maxConnections: 50 })
check("debug updated", r2.debug, true)
check("maxConnections updated", r2.maxConnections, 50)
check("port still 8080", r2.port, 8080)

const r3 = updateConfig(base, {})
check("empty changes: host", r3.host, "localhost")
check("empty changes: port", r3.port, 8080)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
