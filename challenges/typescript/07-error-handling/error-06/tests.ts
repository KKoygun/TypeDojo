import { ServiceError, formatError, shouldRetry } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

const net503: ServiceError = { kind: 'network', statusCode: 503, url: 'https://api.example.com' }
const net404: ServiceError = { kind: 'network', statusCode: 404, url: 'https://api.example.com/nope' }
const timeout: ServiceError = { kind: 'timeout', url: 'https://slow.example.com', durationMs: 5000 }
const config: ServiceError = { kind: 'config', field: 'port', reason: 'must be a number' }

assert(formatError(net503) === "HTTP 503 at https://api.example.com", "format network error")
assert(formatError(timeout) === "Timeout after 5000ms at https://slow.example.com", "format timeout error")
assert(formatError(config) === "Invalid config field 'port': must be a number", "format config error")

assert(shouldRetry(net503) === true, "retry 503")
assert(shouldRetry(net404) === false, "no retry 404")
assert(shouldRetry(timeout) === true, "retry timeout")
assert(shouldRetry(config) === false, "no retry config error")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
