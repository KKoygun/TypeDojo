import { doubleAll, onlyPositive, firstLetters } from "./solution"

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

check("doubleAll [1,2,3]", doubleAll([1, 2, 3]), [2, 4, 6])
check("doubleAll empty", doubleAll([]), [])
check("doubleAll [-1,0,5]", doubleAll([-1, 0, 5]), [-2, 0, 10])

check("onlyPositive [1,-2,3,-4]", onlyPositive([1, -2, 3, -4]), [1, 3])
check("onlyPositive all negative", onlyPositive([-1, -2]), [])
check("onlyPositive empty", onlyPositive([]), [])

check("firstLetters [cat,dog]", firstLetters(["cat", "dog"]), ["c", "d"])
check("firstLetters [Alice,Bob,Carol]", firstLetters(["Alice", "Bob", "Carol"]), ["A", "B", "C"])
check("firstLetters empty", firstLetters([]), [])

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
