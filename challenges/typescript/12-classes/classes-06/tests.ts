import { BaseHealthChecker, HttpChecker, TcpChecker } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

async function main() {
  const http = new HttpChecker("https://example.com")
  assert(http instanceof BaseHealthChecker, "HttpChecker extends BaseHealthChecker")
  assert(http.name === "https://example.com", "HttpChecker name is url")

  const httpResult = await http.check()
  assert(httpResult.name === "https://example.com", "check result has name")
  assert(httpResult.ok === true, "check result ok=true")
  assert(typeof httpResult.latencyMs === "number", "check result has latencyMs")

  const tcp = new TcpChecker("db.internal", 5432)
  assert(tcp instanceof BaseHealthChecker, "TcpChecker extends BaseHealthChecker")
  assert(tcp.name === "db.internal:5432", "TcpChecker name is host:port")

  const tcpResult = await tcp.check()
  assert(tcpResult.ok === true, "tcp check ok=true")

  // Test error handling — subclass that throws
  class FailingChecker extends BaseHealthChecker {
    readonly name = "failing"
    async ping(): Promise<boolean> { throw new Error("connection refused") }
  }
  const failing = new FailingChecker()
  const failResult = await failing.check()
  assert(failResult.ok === false, "failing check returns ok=false")
  assert(typeof failResult.latencyMs === "number", "failing check still has latencyMs")

  if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
  else console.log(`  ${passed} test(s) passed`)
}

main()
