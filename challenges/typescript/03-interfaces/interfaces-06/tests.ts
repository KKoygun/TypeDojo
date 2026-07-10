import { Deployment, describeDeployment } from "./solution"

const cases: [Deployment, string][] = [
  [
    { id: "abc123", name: "api-server", labels: { env: "prod" }, image: "nginx:latest", replicas: 3 },
    "[abc123] api-server → nginx:latest x 3 replicas",
  ],
  [
    { id: "xyz", name: "worker", labels: {}, image: "worker:v2", replicas: 1, env: { LOG_LEVEL: "debug" } },
    "[xyz] worker → worker:v2 x 1 replicas",
  ],
  [
    { id: "q1w2", name: "db-proxy", labels: { team: "infra" }, image: "pgbouncer:1.20", replicas: 2 },
    "[q1w2] db-proxy → pgbouncer:1.20 x 2 replicas",
  ],
]

let passed = 0
let failed = 0

for (const [input, expected] of cases) {
  const result = describeDeployment(input)
  if (result === expected) {
    passed++
  } else {
    console.error(`  FAIL: describeDeployment(...) → "${result}" (expected "${expected}")`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
