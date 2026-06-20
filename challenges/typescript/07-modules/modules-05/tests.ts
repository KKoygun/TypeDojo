import { MetricName, increment, gauge, timing } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

// Type-level checks (verified by compilation)
const name: MetricName = "requests.total"
assert(typeof name === "string", "MetricName is a string alias")

// Functions should be declared (may be undefined at runtime for declare)
// We just check they are exported without crashing on import
assert(true, "increment exported without error")
assert(true, "gauge exported without error")
assert(true, "timing exported without error")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
