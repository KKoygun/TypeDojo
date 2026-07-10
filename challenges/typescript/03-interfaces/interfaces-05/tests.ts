import { createDbConfig } from "./solution"

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

const cfg = createDbConfig("localhost", 5432, "mydb")
check("host", cfg.host, "localhost")
check("port", cfg.port, 5432)
check("dbName", cfg.dbName, "mydb")

const cfg2 = createDbConfig("db.prod.internal", 5433, "production")
check("host-2", cfg2.host, "db.prod.internal")
check("port-2", cfg2.port, 5433)
check("dbName-2", cfg2.dbName, "production")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
