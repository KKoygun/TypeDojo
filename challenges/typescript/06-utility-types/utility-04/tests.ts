import { toPublic, describeUser } from "./solution"

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

const full = {
  id: "1",
  name: "Alice",
  email: "alice@example.com",
  password: "secret",
  createdAt: "2024-01-01",
  role: "admin"
}

const pub = toPublic(full)
check("id kept", pub.id, "1")
check("name kept", pub.name, "Alice")
check("email kept", pub.email, "alice@example.com")
check("role kept", pub.role, "admin")
check("password omitted", "password" in pub, false)
check("createdAt omitted", "createdAt" in pub, false)

check("describeUser", describeUser(pub), "Alice (admin)")

const pub2 = toPublic({ id: "2", name: "Bob", email: "bob@corp.io", password: "pw", createdAt: "2024-02-01", role: "viewer" })
check("describeUser-2", describeUser(pub2), "Bob (viewer)")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
