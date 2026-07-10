import { getLength, getLongest } from "./solution"

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

check("getLength string", getLength("hello"), 5)
check("getLength array", getLength([1, 2, 3]), 3)
check("getLength empty", getLength([]), 0)
check("getLength empty string", getLength(""), 0)

check("getLongest longer string wins", getLongest("ab", "abc"), "abc")
check("getLongest equal returns a", getLongest("ab", "cd"), "ab")

const arr = [1, 2, 3]
const short = [1]
const longest = getLongest(arr, short)
if (longest !== arr) {
  console.error(`  FAIL [getLongest longer array wins]: got ${JSON.stringify(longest)}, expected [1,2,3]`)
  failed++
} else {
  passed++
}

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
