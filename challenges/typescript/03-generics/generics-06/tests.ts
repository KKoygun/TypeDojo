import { succeed, fail, unwrap } from "./solution"

let passed = 0
let failed = 0

function assert(condition: boolean, label: string): void {
  if (condition) { passed++ }
  else { console.error(`  FAIL: ${label}`); failed++ }
}

const s = succeed(42)
assert(s.ok === true, "succeed sets ok to true")
assert(unwrap(s) === 42, "unwrap returns value from success")

const f = fail<number>("not found")
assert(f.ok === false, "fail sets ok to false")

let threw = false
try { unwrap(f) } catch (e) { threw = true }
assert(threw, "unwrap throws on failure")

const s2 = succeed("hello")
assert(unwrap(s2) === "hello", "succeed works with strings")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
