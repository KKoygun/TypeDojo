import { identity, firstItem } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown): void {
  if (got === expected) {
    passed++
  } else {
    console.error(`  FAIL [${label}]: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`)
    failed++
  }
}

check("identity number", identity(42), 42)
check("identity string", identity("hello"), "hello")
check("identity boolean", identity(true), true)
check("identity null", identity(null), null)

check("firstItem number array", firstItem([1, 2, 3]), 1)
check("firstItem string array", firstItem(["a", "b"]), "a")
check("firstItem single", firstItem([99]), 99)
check("firstItem empty", firstItem([]), undefined)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
