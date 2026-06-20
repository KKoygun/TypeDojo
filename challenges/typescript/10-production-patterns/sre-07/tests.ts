import { runHealthChecks, isHealthy, summarize } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

async function main() {
  const report = await runHealthChecks({
    db: async () => ({ ok: true, latencyMs: 12 }),
    cache: async () => ({ ok: true, latencyMs: 5 }),
    queue: async () => { throw new Error("connection refused") },
    api: async () => ({ ok: true, latencyMs: 8 }),
  })

  assert("db" in report, "db in report")
  assert("cache" in report, "cache in report")
  assert("queue" in report, "queue in report")
  assert("api" in report, "api in report")
  assert(report.db!.ok === true, "db ok")
  assert(report.cache!.ok === true, "cache ok")
  assert(report.queue!.ok === false, "queue failed")
  assert(typeof report.queue!.error === "string", "queue has error string")
  assert(report.queue!.error!.includes("connection refused"), "queue error message")
  assert(report.api!.ok === true, "api ok")
  assert(typeof report.db!.latencyMs === "number", "db has latency")

  assert(isHealthy({ db: { ok: true, latencyMs: 1 } }), "isHealthy all ok")
  assert(!isHealthy({ db: { ok: true, latencyMs: 1 }, cache: { ok: false, latencyMs: 0, error: "down" } }), "isHealthy false when one fails")

  const summary = summarize(report)
  assert(summary.startsWith("3/4 healthy"), "summary correct count")
  assert(summary.includes("FAILED"), "summary mentions failed check")

  if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
  else console.log(`  ${passed} test(s) passed`)
}

main()
