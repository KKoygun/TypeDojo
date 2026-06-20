import { parseConfig } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (did not throw)`); failed++ }
  catch { passed++ }
}

const valid = parseConfig({ host: "localhost", port: 8080, logLevel: "info" })
assert(valid.host === "localhost", "host parsed")
assert(valid.port === 8080, "port parsed")
assert(valid.logLevel === "info", "logLevel parsed")
assert(valid.workers === 1, "workers defaults to 1")

const withWorkers = parseConfig({ host: "db", port: 5432, logLevel: "debug", workers: 4 })
assert(withWorkers.workers === 4, "workers parsed when provided")

assertThrows(() => parseConfig(null), "throws on null")
assertThrows(() => parseConfig("string"), "throws on string")
assertThrows(() => parseConfig({ port: 8080, logLevel: "info" }), "throws on missing host")
assertThrows(() => parseConfig({ host: 123, port: 8080, logLevel: "info" }), "throws on non-string host")
assertThrows(() => parseConfig({ host: "x", logLevel: "info" }), "throws on missing port")
assertThrows(() => parseConfig({ host: "x", port: "8080", logLevel: "info" }), "throws on string port")
assertThrows(() => parseConfig({ host: "x", port: 8080, logLevel: "verbose" }), "throws on invalid logLevel")
assertThrows(() => parseConfig({ host: "x", port: 8080 }), "throws on missing logLevel")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
