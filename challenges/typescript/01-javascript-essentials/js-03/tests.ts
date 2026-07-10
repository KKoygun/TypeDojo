import { greet, truncate, power } from "./solution"

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

check("greet default greeting", greet("Alice"), "Hello, Alice!")
check("greet custom greeting", greet("Bob", "Hi"), "Hi, Bob!")
check("greet another custom", greet("Carol", "Hey"), "Hey, Carol!")

check("truncate short stays unchanged", truncate("hello"), "hello")
check("truncate exactly 20 chars", truncate("12345678901234567890"), "12345678901234567890")
check("truncate long string", truncate("abcdefghijklmnopqrstuvwxyz"), "abcdefghijklmnopqrst...")
check("truncate custom max 5", truncate("hello world", 5), "hello...")
check("truncate short with custom max", truncate("hi", 10), "hi")

check("power default exp is 2", power(3), 9)
check("power custom exp", power(2, 10), 1024)
check("power exp 0", power(5, 0), 1)
check("power exp 1", power(7, 1), 7)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
