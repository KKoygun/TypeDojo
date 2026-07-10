import { pair, swap, mapFirst } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown): void {
  if (JSON.stringify(got) === JSON.stringify(expected)) {
    passed++
  } else {
    console.error(`  FAIL [${label}]: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`)
    failed++
  }
}

check("pair strings", pair("a", "b"), ["a", "b"])
check("pair mixed", pair(1, "hello"), [1, "hello"])
check("pair booleans", pair(true, false), [true, false])

check("swap strings", swap(["a", "b"]), ["b", "a"])
check("swap mixed", swap([42, "world"]), ["world", 42])

check("mapFirst doubles", mapFirst([5, "x"], n => n * 2), [10, "x"])
check("mapFirst stringify", mapFirst([99, true], n => String(n)), ["99", true])

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
