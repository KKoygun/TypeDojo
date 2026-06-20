import { parseArgs } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

const r1 = parseArgs(["node", "script.js", "--host", "localhost", "--port", "8080", "--verbose"])
assert(r1["host"] === "localhost", "parses --host")
assert(r1["port"] === "8080", "parses --port")
assert(r1["verbose"] === true, "parses --verbose as boolean flag")

const r2 = parseArgs(["node", "script.js"])
assert(Object.keys(r2).length === 0, "empty args returns empty object")

const r3 = parseArgs(["node", "script.js", "--debug"])
assert(r3["debug"] === true, "single flag is boolean true")

const r4 = parseArgs(["node", "script.js", "--a", "1", "--b", "--c", "3"])
assert(r4["a"] === "1", "a has value")
assert(r4["b"] === true, "b is boolean flag between two keyed args")
assert(r4["c"] === "3", "c has value")

const r5 = parseArgs(["node", "script.js", "--env", "prod", "--region", "us-east-1"])
assert(r5["env"] === "prod", "env value with hyphen in value")
assert(r5["region"] === "us-east-1", "region value with hyphen")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
