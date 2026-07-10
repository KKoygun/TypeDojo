import { mergeConfigs, getMetric, FlexibleConfig, MetricsMap } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

const base: FlexibleConfig = { name: "api", version: 1, debug: false, timeout: 30 }
const merged = mergeConfigs(base, { version: 2, debug: true })
ok(merged.name === "api", "merge keeps unmodified fields")
ok(merged.version === 2, "merge overrides version")
ok(merged.debug === true, "merge overrides debug")
ok(merged.timeout === 30, "merge keeps timeout")

const emptyMerge = mergeConfigs(base, {})
ok(emptyMerge.name === "api", "empty override keeps base")

const metrics: MetricsMap = { timestamp: Date.now(), requests: 100, errors: 5, latency: 42 }
ok(getMetric(metrics, "requests") === 100, "getMetric existing number")
ok(getMetric(metrics, "timestamp") === metrics.timestamp, "getMetric timestamp")
ok(getMetric(metrics, "nonexistent") === undefined, "getMetric missing returns undefined")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
