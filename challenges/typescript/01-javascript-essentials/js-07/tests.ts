import { formatGreeting, formatPath } from "./solution"

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

check("greeting Alice 30", formatGreeting("Alice", 30), "Hello, Alice! You are 30 years old.")
check("greeting Bob 25", formatGreeting("Bob", 25), "Hello, Bob! You are 25 years old.")

check("path src index ts", formatPath("src", "index", "ts"), "src/index.ts")
check("path dist app js", formatPath("dist", "app", "js"), "dist/app.js")
check("path config main json", formatPath("config", "main", "json"), "config/main.json")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
