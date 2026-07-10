import { username, requestCount, isAuthenticated } from "./solution"

let passed = 0
let failed = 0

function check(label: string, value: boolean) {
  if (value) { console.log(`  PASS  ${label}`); passed++ }
  else { console.error(`  FAIL  ${label}`); failed++ }
}

check("username is 'alice'", username === "alice")
check("requestCount is 0", requestCount === 0)
check("isAuthenticated is false", isAuthenticated === false)

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`\n  ${passed} test(s) passed`)
