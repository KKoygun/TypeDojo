import { freezeConfig, describeConfig } from "./solution"

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

const cfg = { host: "db.prod.internal", port: 5432, name: "production", user: "admin", password: "secret" }
const frozen = freezeConfig(cfg)

check("host preserved", frozen.host, "db.prod.internal")
check("port preserved", frozen.port, 5432)
check("name preserved", frozen.name, "production")
check("user preserved", frozen.user, "admin")
check("password preserved", frozen.password, "secret")

check("describeConfig", describeConfig(frozen), "admin@db.prod.internal:5432/production")

const cfg2 = { host: "localhost", port: 5433, name: "dev", user: "dev_user", password: "pw" }
check("describeConfig-2", describeConfig(freezeConfig(cfg2)), "dev_user@localhost:5433/dev")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
