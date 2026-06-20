import { JsonLineParser, parseJsonLines } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

// parseJsonLines basic
const lines = '{"name":"api","port":8080}\n{"name":"db","port":5432}\n{"name":"cache","port":6379}'
const results = parseJsonLines<{ name: string; port: number }>(lines)
assert(results.length === 3, "parses 3 lines")
assert(results[0]?.name === "api", "first object name")
assert(results[1]?.port === 5432, "second object port")
assert(results[2]?.name === "cache", "third object name")

// blank lines are skipped
const withBlanks = '{"x":1}\n\n{"x":2}\n\n'
const r2 = parseJsonLines<{ x: number }>(withBlanks)
assert(r2.length === 2, "blank lines skipped")

// single line no trailing newline
const single = '{"ok":true}'
const r3 = parseJsonLines<{ ok: boolean }>(single)
assert(r3.length === 1, "single line no newline")
assert(r3[0]?.ok === true, "single line value")

// stream emits error on invalid JSON
const parser = new JsonLineParser()
let errorEmitted = false
parser.on('error', () => { errorEmitted = true })
parser.write('{"valid":true}\n')
parser.write('not valid json\n')
assert(errorEmitted, "stream emits error on invalid JSON")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
