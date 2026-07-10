import { success, failure } from "./solution"

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

const s1 = success("hello")
check("success data", s1.data, "hello")
check("success status", s1.status, 200)
check("success no error", s1.error, undefined)

const s2 = success([1, 2, 3])
check("success array data", JSON.stringify(s2.data), JSON.stringify([1, 2, 3]))
check("success array status", s2.status, 200)

const f1 = failure("not found")
check("failure data", f1.data, null)
check("failure status", f1.status, 500)
check("failure error", f1.error, "not found")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
