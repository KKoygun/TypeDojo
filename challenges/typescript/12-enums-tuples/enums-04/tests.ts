import { trySplit, minMax, parseKeyValue } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (no throw)`); failed++ } catch { passed++ }
}

const [parts1, found1] = trySplit("a,b,c", ",")
assert(found1 === true, "trySplit found delimiter")
assert(JSON.stringify(parts1) === JSON.stringify(["a","b","c"]), "trySplit correct parts")

const [parts2, found2] = trySplit("hello", ",")
assert(found2 === false, "trySplit delimiter not found")
assert(JSON.stringify(parts2) === JSON.stringify(["hello"]), "trySplit wraps in array")

const [mn, mx] = minMax([3, 1, 4, 1, 5, 9])
assert(mn === 1, "minMax min correct")
assert(mx === 9, "minMax max correct")
assertThrows(() => minMax([]), "minMax throws on empty")

assert(JSON.stringify(parseKeyValue("HOST=localhost")) === JSON.stringify(["HOST","localhost"]), "parseKeyValue basic")
assert(JSON.stringify(parseKeyValue("URL=http://example.com")) === JSON.stringify(["URL","http://example.com"]), "parseKeyValue value with equals")
assert(parseKeyValue("INVALID") === null, "parseKeyValue no equals → null")
assert(parseKeyValue("=VALUE") !== null, "parseKeyValue empty key is ok")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
