import { assertDefined, assertPort, assertLogLevel, assertConfig } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (no throw)`); failed++ } catch { passed++ }
}
function assertPasses(fn: () => unknown, label: string) {
  try { fn(); passed++ } catch (e) { console.error(`  FAIL: ${label}: ${e}`); failed++ }
}

assertPasses(() => assertDefined("value", "name"), "assertDefined passes on string")
assertPasses(() => assertDefined(0, "zero"), "assertDefined passes on 0")
assertThrows(() => assertDefined(undefined, "x"), "assertDefined throws on undefined")
assertThrows(() => assertDefined(null, "x"), "assertDefined throws on null")

assertPasses(() => assertPort(8080), "assertPort valid")
assertPasses(() => assertPort(1), "assertPort min")
assertPasses(() => assertPort(65535), "assertPort max")
assertThrows(() => assertPort(0), "assertPort 0 invalid")
assertThrows(() => assertPort(65536), "assertPort too high")
assertThrows(() => assertPort(3.14), "assertPort float invalid")
assertThrows(() => assertPort("8080"), "assertPort string invalid")

assertPasses(() => assertLogLevel("debug"), "assertLogLevel debug")
assertPasses(() => assertLogLevel("error"), "assertLogLevel error")
assertThrows(() => assertLogLevel("verbose"), "assertLogLevel verbose invalid")
assertThrows(() => assertLogLevel(1), "assertLogLevel number invalid")

const valid = { host: "localhost", port: 8080, workers: 4, logLevel: "info" }
assertPasses(() => assertConfig(valid), "assertConfig valid")
assertThrows(() => assertConfig({ ...valid, port: 0 }), "assertConfig invalid port")
assertThrows(() => assertConfig({ ...valid, logLevel: "verbose" }), "assertConfig invalid logLevel")
assertThrows(() => assertConfig(null), "assertConfig null")
assertThrows(() => assertConfig({ host: "x" }), "assertConfig missing fields")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
