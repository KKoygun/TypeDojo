import { sumOf, longestWord, pipeline } from "./solution"

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

check("sumOf [1,2,3]", sumOf([1, 2, 3]), 6)
check("sumOf [10,20,30]", sumOf([10, 20, 30]), 60)
check("sumOf empty", sumOf([]), 0)
check("sumOf negatives", sumOf([-1, -2, 3]), 0)

check("longestWord [cat,elephant,dog]", longestWord(["cat", "elephant", "dog"]), "elephant")
check("longestWord [hi,hello]", longestWord(["hi", "hello"]), "hello")
check("longestWord empty", longestWord([]), "")
check("longestWord single", longestWord(["only"]), "only")

check("pipeline [1,-2,3,-4,5]", pipeline([1, -2, 3, -4, 5]), [1, 9, 25])
check("pipeline all negative", pipeline([-1, -2]), [])
check("pipeline [2,3]", pipeline([2, 3]), [4, 9])

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
