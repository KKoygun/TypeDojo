import { buildEnvMap, getEnv } from "./solution"

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

const map = buildEnvMap([["HOST", "localhost"], ["PORT", "8080"], ["ENV", "prod"]])
check("HOST", map["HOST"], "localhost")
check("PORT", map["PORT"], "8080")
check("ENV", map["ENV"], "prod")

const empty = buildEnvMap([])
check("empty map", Object.keys(empty).length, 0)

check("getEnv found", getEnv(map, "HOST", "default"), "localhost")
check("getEnv fallback", getEnv(map, "MISSING", "fallback"), "fallback")
check("getEnv empty fallback", getEnv({}, "ANY", "x"), "x")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
