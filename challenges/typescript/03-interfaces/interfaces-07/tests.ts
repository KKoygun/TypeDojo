import { mergeLabels } from "./solution"

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

check(
  "b wins on conflict",
  mergeLabels({ env: "staging", team: "platform" }, { env: "prod" }),
  { env: "prod", team: "platform" }
)

check(
  "no overlap",
  mergeLabels({ a: "1" }, { b: "2" }),
  { a: "1", b: "2" }
)

check(
  "empty a",
  mergeLabels({}, { x: "y" }),
  { x: "y" }
)

check(
  "empty b",
  mergeLabels({ x: "y" }, {}),
  { x: "y" }
)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
