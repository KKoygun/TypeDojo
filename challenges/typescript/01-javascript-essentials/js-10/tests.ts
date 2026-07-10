import { initials, firstAndRest } from "./solution"

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

check("initials Alice Smith", initials({ firstName: "Alice", lastName: "Smith" }), "A.S.")
check("initials Bob Jones", initials({ firstName: "Bob", lastName: "Jones" }), "B.J.")
check("initials Carol White", initials({ firstName: "Carol", lastName: "White" }), "C.W.")

check("firstAndRest [a,b,c]", firstAndRest(["a", "b", "c"]), { first: "a", rest: ["b", "c"] })
check("firstAndRest [x]", firstAndRest(["x"]), { first: "x", rest: [] })
check("firstAndRest [1,2,3,4]", firstAndRest(["1", "2", "3", "4"]), { first: "1", rest: ["2", "3", "4"] })

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
