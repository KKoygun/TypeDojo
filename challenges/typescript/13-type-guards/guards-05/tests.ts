import { loadAppEnv } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (no throw)`); failed++ } catch { passed++ }
}

// test defaults
delete process.env.APP_ENV
delete process.env.LOG_LEVEL
delete process.env.PORT
delete process.env.DB_URL

assertThrows(() => loadAppEnv(), "throws when DB_URL missing")

process.env.DB_URL = "postgresql://localhost:5432/mydb"
const env1 = loadAppEnv()
assert(env1.appEnv === "development", "default APP_ENV")
assert(env1.logLevel === "info", "default LOG_LEVEL")
assert(env1.port === 3000, "default PORT as number")
assert(env1.dbUrl === "postgresql://localhost:5432/mydb", "DB_URL read correctly")

process.env.APP_ENV = "production"
process.env.LOG_LEVEL = "warn"
process.env.PORT = "8080"
const env2 = loadAppEnv()
assert(env2.appEnv === "production", "APP_ENV overridden")
assert(env2.logLevel === "warn", "LOG_LEVEL overridden")
assert(env2.port === 8080, "PORT parsed as int")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
