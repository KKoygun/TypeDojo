import { getEnv, getEnvInt, getEnvBool, getEnvEnum } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (did not throw)`); failed++ }
  catch { passed++ }
}

process.env._TEST_STR = "hello"
process.env._TEST_INT = "42"
process.env._TEST_BOOL_T = "true"
process.env._TEST_BOOL_F = "false"
process.env._TEST_BOOL_1 = "1"
process.env._TEST_BOOL_0 = "0"
process.env._TEST_ENUM = "prod"

assert(getEnv("_TEST_STR") === "hello", "getEnv reads existing var")
assert(getEnv("_NOT_SET_XYZ", "default") === "default", "getEnv uses fallback")
assertThrows(() => getEnv("_NOT_SET_XYZ"), "getEnv throws with no fallback")

assert(getEnvInt("_TEST_INT") === 42, "getEnvInt reads int")
assert(getEnvInt("_NOT_SET_INT_XYZ", 99) === 99, "getEnvInt uses fallback")
process.env._BAD_INT = "abc"
assertThrows(() => getEnvInt("_BAD_INT"), "getEnvInt throws on non-integer")

assert(getEnvBool("_TEST_BOOL_T") === true, "getEnvBool true")
assert(getEnvBool("_TEST_BOOL_F") === false, "getEnvBool false")
assert(getEnvBool("_TEST_BOOL_1") === true, "getEnvBool 1")
assert(getEnvBool("_TEST_BOOL_0") === false, "getEnvBool 0")
assert(getEnvBool("_NOT_SET_BOOL_XYZ", true) === true, "getEnvBool fallback")
process.env._BAD_BOOL = "yes"
assertThrows(() => getEnvBool("_BAD_BOOL"), "getEnvBool throws on invalid value")

assert(getEnvEnum("_TEST_ENUM", ["prod", "staging", "dev"] as const) === "prod", "getEnvEnum valid")
assert(getEnvEnum("_NOT_SET_ENUM_XYZ", ["prod", "staging"] as const, "staging") === "staging", "getEnvEnum fallback")
process.env._BAD_ENUM = "local"
assertThrows(() => getEnvEnum("_BAD_ENUM", ["prod", "staging", "dev"] as const), "getEnvEnum throws on invalid value")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
