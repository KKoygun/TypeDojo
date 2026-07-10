import { runHealthChecks, isHealthy, summarize } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

const checks = {
  db:    async () => ({ ok: true,  latencyMs: 12, error: undefined }),
  cache: async () => ({ ok: true,  latencyMs: 5,  error: undefined }),
  queue: async () => { throw new Error("connection refused") },
}

const report = await runHealthChecks(checks)

ok(typeof report === "object", "report is object")
ok(report.db?.ok === true, "db ok")
ok(report.cache?.ok === true, "cache ok")
ok(report.queue?.ok === false, "queue failed")
ok(typeof report.queue?.latencyMs === "number", "queue has latencyMs")
ok(report.queue?.error?.includes("connection refused"), "queue has error message")

ok(isHealthy({ db: { ok: true, latencyMs: 1 }, cache: { ok: true, latencyMs: 1 } }), "isHealthy true when all ok")
ok(!isHealthy(report), "isHealthy false when any fail")

const summary = summarize(report)
ok(summary.includes("2/3"), "summary shows 2/3")
ok(summary.includes("db"), "summary includes db")
ok(summary.includes("FAILED"), "summary shows FAILED for queue")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
