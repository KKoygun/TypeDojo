import { parseAppConfig } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (no throw)`); failed++ } catch { passed++ }
}

const valid = parseAppConfig({ host: "localhost", port: 8080, logLevel: "info" })
assert(valid.host === "localhost", "host parsed")
assert(valid.port === 8080, "port parsed")
assert(valid.logLevel === "info", "logLevel parsed")
assert(valid.workers === 1, "workers defaults to 1")
assert(Array.isArray(valid.tags) && valid.tags.length === 0, "tags defaults to []")

const withAll = parseAppConfig({ host: "db", port: 5432, logLevel: "debug", workers: 4, tags: ["sre", "db"] })
assert(withAll.workers === 4, "workers explicit")
assert(JSON.stringify(withAll.tags) === JSON.stringify(["sre","db"]), "tags explicit")

assertThrows(() => parseAppConfig({ port: 8080, logLevel: "info" }), "throws missing host")
assertThrows(() => parseAppConfig({ host: "", port: 8080, logLevel: "info" }), "throws empty host")
assertThrows(() => parseAppConfig({ host: "x", port: 0, logLevel: "info" }), "throws port 0")
assertThrows(() => parseAppConfig({ host: "x", port: 65536, logLevel: "info" }), "throws port too high")
assertThrows(() => parseAppConfig({ host: "x", port: 8080, logLevel: "verbose" }), "throws invalid logLevel")
assertThrows(() => parseAppConfig(null), "throws on null")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
