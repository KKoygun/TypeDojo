import { createUser } from "./solution"

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

const u1 = createUser("1", "Alice", "alice@example.com")
check("id", u1.id, "1")
check("name", u1.name, "Alice")
check("email", u1.email, "alice@example.com")

const u2 = createUser("42", "Bob", "bob@corp.io")
check("id-2", u2.id, "42")
check("name-2", u2.name, "Bob")
check("email-2", u2.email, "bob@corp.io")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
