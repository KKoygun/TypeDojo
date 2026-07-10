import { httpResponse, spread, zipPairs } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

const [status, body, headers] = httpResponse("hello")
assert(status === 200, "httpResponse status 200")
assert(body === "hello", "httpResponse body")
assert(typeof headers === "object" && headers !== null, "httpResponse headers object")
assert(Object.keys(headers).length === 0, "httpResponse default empty headers")

const [s2, b2, h2] = httpResponse("ok", { "X-Custom": "yes" })
assert(h2["X-Custom"] === "yes", "httpResponse custom headers")

const s = spread("first", 1, 2, 3)
assert(s[0] === "first", "spread first element")
assert(s[1] === 1, "spread second element")
assert(s.length === 4, "spread total length")

const s2r = spread("a", "b", "c")
assert(s2r.length === 3, "spread strings")
assert(s2r[1] === "b", "spread strings value")

const pairs = zipPairs(["a", "b", "c"], [1, 2, 3])
assert(pairs.length === 3, "zipPairs same length")
assert(JSON.stringify(pairs[0]) === JSON.stringify(["a", 1]), "zipPairs first pair")
assert(JSON.stringify(pairs[2]) === JSON.stringify(["c", 3]), "zipPairs last pair")

const shorter = zipPairs(["x", "y"], [10, 20, 30])
assert(shorter.length === 2, "zipPairs stops at shorter array")

const empty = zipPairs([], [1, 2])
assert(empty.length === 0, "zipPairs empty keys")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
