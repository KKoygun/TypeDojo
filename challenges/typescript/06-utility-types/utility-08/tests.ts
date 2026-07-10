import { toPublic, applyPatch } from "./solution"

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

const svc = { id: "1", name: "api", endpoint: "https://api.example.com", apiKey: "secret123", timeout: 5000 }

const pub = toPublic(svc)
check("id kept", pub.id, "1")
check("name kept", pub.name, "api")
check("endpoint kept", pub.endpoint, "https://api.example.com")
check("apiKey omitted", "apiKey" in pub, false)

const patched = applyPatch(svc, { name: "api-v2", timeout: 3000 })
check("name updated", patched.name, "api-v2")
check("timeout updated", patched.timeout, 3000)
check("id preserved", patched.id, "1")
check("apiKey preserved", patched.apiKey, "secret123")
check("endpoint preserved", patched.endpoint, "https://api.example.com")

const patched2 = applyPatch(svc, {})
check("empty patch preserves all", patched2.name, "api")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
