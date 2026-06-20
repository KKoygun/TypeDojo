import { loadEnv, buildServiceUrls } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

// loadEnv tests
process.env.TEST_HOST = "localhost"
process.env.TEST_PORT = "8080"

const env = loadEnv(["TEST_HOST", "TEST_PORT"])
assert(env["TEST_HOST"] === "localhost", "loads existing env var")
assert(env["TEST_PORT"] === "8080", "loads second env var")

let threw = false
try { loadEnv(["DEFINITELY_NOT_SET_XYZ"]) } catch { threw = true }
assert(threw, "throws on missing env var")

// buildServiceUrls tests
const urls = buildServiceUrls({ API_HOST: "api.example.com", DB_HOST: "db.example.com", CACHE_HOST: "cache.example.com" })
assert(urls["api"] === "http://api.example.com", "api url correct")
assert(urls["db"] === "postgresql://db.example.com", "db url correct")
assert(urls["cache"] === "redis://cache.example.com", "cache url correct")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
