import { fullName, formatContact } from "./solution"

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

const alice = {
  id: "1",
  firstName: "Alice",
  lastName: "Smith",
  email: "alice@example.com",
  address: { street: "1 Main St", city: "London", country: "UK" }
}

check("fullName", fullName(alice), "Alice Smith")
check("formatContact", formatContact(alice), "Alice Smith <alice@example.com> - London")

const bob = {
  id: "2",
  firstName: "Bob",
  lastName: "Jones",
  email: "bob@corp.io",
  phone: "+44 7700 900000",
  address: { street: "42 High St", city: "Manchester", country: "UK", postCode: "M1 1AA" }
}

check("fullName-2", fullName(bob), "Bob Jones")
check("formatContact-2", formatContact(bob), "Bob Jones <bob@corp.io> - Manchester")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
