import { isEnvironment, isLogLevel, parseEnv, parseLogLevel } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (no throw)`); failed++ } catch { passed++ }
}

assert(isEnvironment("prod") === true, "prod is environment")
assert(isEnvironment("staging") === true, "staging is environment")
assert(isEnvironment("dev") === true, "dev is environment")
assert(isEnvironment("local") === false, "local is not environment")
assert(isEnvironment(42) === false, "number is not environment")
assert(isEnvironment(null) === false, "null is not environment")

assert(isLogLevel("debug") === true, "debug is log level")
assert(isLogLevel("info") === true, "info is log level")
assert(isLogLevel("verbose") === false, "verbose is not log level")

assert(parseEnv("prod") === "prod", "parseEnv valid")
assertThrows(() => parseEnv("local"), "parseEnv invalid throws")
assertThrows(() => parseEnv(undefined), "parseEnv undefined throws")

assert(parseLogLevel("warn") === "warn", "parseLogLevel valid")
assertThrows(() => parseLogLevel("trace"), "parseLogLevel invalid throws")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
