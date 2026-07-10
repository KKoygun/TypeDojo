import { groupBy, summarize } from "./solution"

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

// groupBy
check(
  "groupBy by first letter",
  groupBy(["apple", "ant", "bee"], s => s.charAt(0)),
  { a: ["apple", "ant"], b: ["bee"] }
)
check(
  "groupBy by length",
  groupBy(["a", "bb", "cc", "ddd"], s => String(s.length)),
  { "1": ["a"], "2": ["bb", "cc"], "3": ["ddd"] }
)
check(
  "groupBy single item",
  groupBy(["only"], s => s.charAt(0)),
  { o: ["only"] }
)
check("groupBy empty", groupBy([], s => s.charAt(0)), {})

// summarize
check(
  "summarize some passed",
  summarize([{ name: "Alice", score: 80 }, { name: "Bob", score: 55 }, { name: "Carol", score: 40 }]),
  "Passed: Alice, Bob (2/3)"
)
check(
  "summarize none passed",
  summarize([{ name: "Dave", score: 30 }, { name: "Eve", score: 49 }]),
  "None passed (0/2)"
)
check(
  "summarize all passed",
  summarize([{ name: "Frank", score: 50 }, { name: "Grace", score: 100 }]),
  "Passed: Frank, Grace (2/2)"
)
check(
  "summarize exactly 50 passes",
  summarize([{ name: "Hana", score: 50 }]),
  "Passed: Hana (1/1)"
)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
