import { AppError, NetworkError, ConfigError, handleError } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

const net = new NetworkError("connection refused", "NET_001", 503)
assert(net instanceof NetworkError, "NetworkError instanceof NetworkError")
assert(net instanceof AppError, "NetworkError instanceof AppError")
assert(net instanceof Error, "NetworkError instanceof Error")
assert(net.statusCode === 503, "statusCode set")
assert(net.code === "NET_001", "code set")
assert(net.message === "connection refused", "message set")

const cfg = new ConfigError("invalid value", "CFG_002", "port")
assert(cfg instanceof ConfigError, "ConfigError instanceof ConfigError")
assert(cfg.field === "port", "field set")

assert(handleError(net) === "Network [503]: connection refused", "handleError NetworkError")
assert(handleError(cfg) === "Config error on field 'port': invalid value", "handleError ConfigError")

const app = new AppError("something broke", "APP_001")
assert(handleError(app) === "App error [APP_001]: something broke", "handleError AppError")
assert(handleError(new Error("plain")) === "Error: plain", "handleError Error")
assert(handleError("string error") === "Unknown error", "handleError unknown")
assert(handleError(null) === "Unknown error", "handleError null")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
