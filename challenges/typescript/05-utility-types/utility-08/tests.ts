import { PublicSpec, PatchSpec, EnvMap, makeEnvMap } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

const spec: PublicSpec = { name: "api", image: "nginx:1", port: 8080, replicas: 2 }
assert(!("id" in spec), "PublicSpec has no id")
assert(!("secret" in spec), "PublicSpec has no secret")
assert("name" in spec, "PublicSpec has name")

const patch: PatchSpec = {}
assert(typeof patch === "object", "PatchSpec accepts empty object (all optional)")
const patch2: PatchSpec = { name: "api-v2" }
assert(patch2.name === "api-v2", "PatchSpec accepts partial update")

const prod: PublicSpec = { name: "api-prod", image: "nginx:1", port: 443, replicas: 3 }
const staging: PublicSpec = { name: "api-staging", image: "nginx:1", port: 8080, replicas: 1 }
const dev: PublicSpec = { name: "api-dev", image: "nginx:dev", port: 3000, replicas: 1 }

const map = makeEnvMap([prod, staging, dev])
assert(map.prod.name === "api-prod", "prod mapped correctly")
assert(map.staging.name === "api-staging", "staging mapped correctly")
assert(map.dev.name === "api-dev", "dev mapped correctly")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
