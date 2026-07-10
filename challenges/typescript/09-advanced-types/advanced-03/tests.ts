import { toStrings } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

// Runtime test for toStrings
const result = toStrings({ host: "localhost", port: 8080, active: true, count: 0 })
assert(result.host === "localhost", "string stays string")
assert(result.port === "8080", "number to string")
assert(result.active === "true", "boolean to string")
assert(result.count === "0", "zero to string")

const result2 = toStrings({ x: null, y: undefined, z: 42 })
assert(result2.x === "null", "null to string")
assert(result2.y === "undefined", "undefined to string")
assert(result2.z === "42", "number to string 2")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
