import { loadConfig, ConfigError, fetchWithTimeout, HttpError, log, LogLevel } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

assert(typeof loadConfig === "function", "loadConfig exported")
assert(typeof ConfigError === "function", "ConfigError exported")
assert(typeof fetchWithTimeout === "function", "fetchWithTimeout exported")
assert(typeof HttpError === "function", "HttpError exported")
assert(typeof log === "function", "log exported")

const e1 = new ConfigError("test")
assert(e1 instanceof ConfigError, "ConfigError is constructable")
const e2 = new HttpError("test")
assert(e2 instanceof HttpError, "HttpError is constructable")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
