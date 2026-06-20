import { PortSchema, UrlSchema, EnvSchema } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertFails(schema: { safeParse: (v: unknown) => { success: boolean } }, val: unknown, label: string) {
  assert(schema.safeParse(val).success === false, label)
}
function assertParses<T>(schema: { parse: (v: unknown) => T }, val: unknown, expected: T, label: string) {
  try {
    const result = schema.parse(val)
    assert(JSON.stringify(result) === JSON.stringify(expected), label)
  } catch (e) { console.error(`  FAIL: ${label}: threw ${e}`); failed++ }
}

assertParses(PortSchema, 8080, 8080, "PortSchema number")
assertParses(PortSchema, "3000", 3000, "PortSchema string → number")
assertFails(PortSchema, 0, "PortSchema rejects 0")
assertFails(PortSchema, 65536, "PortSchema rejects 65536")
assertFails(PortSchema, "abc", "PortSchema rejects non-numeric string")

assertParses(UrlSchema, "http://example.com", "http://example.com", "UrlSchema http")
assertParses(UrlSchema, "https://api.example.com", "https://api.example.com", "UrlSchema https")
assertFails(UrlSchema, "ftp://example.com", "UrlSchema rejects ftp")
assertFails(UrlSchema, "example.com", "UrlSchema rejects no protocol")

const env = EnvSchema.parse({ PORT: "8080", API_URL: "https://api.example.com", LOG_LEVEL: "INFO", DEBUG: "1" })
assert(env.PORT === 8080, "EnvSchema PORT parsed to number")
assert(env.API_URL === "https://api.example.com", "EnvSchema API_URL")
assert(env.LOG_LEVEL === "info", "EnvSchema LOG_LEVEL lowercased")
assert(env.DEBUG === true, "EnvSchema DEBUG '1' → true")

const env2 = EnvSchema.parse({ PORT: "443", API_URL: "http://internal", LOG_LEVEL: "WARN", DEBUG: "0" })
assert(env2.DEBUG === false, "EnvSchema DEBUG '0' → false")
assert(env2.LOG_LEVEL === "warn", "EnvSchema LOG_LEVEL warn")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
