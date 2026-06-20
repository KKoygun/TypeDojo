import { patch, toPublic } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

const base = { id: "abc", name: "api", image: "nginx:1", replicas: 2 }

const p1 = patch(base, { replicas: 5 })
assert(p1.id === "abc", "id preserved")
assert(p1.replicas === 5, "replicas updated")
assert(p1.name === "api", "name preserved")
assert(p1.image === "nginx:1", "image preserved")

const p2 = patch(base, { name: "api-v2", image: "nginx:2" })
assert(p2.name === "api-v2", "name updated")
assert(p2.image === "nginx:2", "image updated")
assert(p2.id === "abc", "id still preserved")

const p3 = patch(base, {})
assert(JSON.stringify(p3) === JSON.stringify(base), "empty patch returns same values")

const pub = toPublic(base)
assert(!("id" in pub), "id removed from public")
assert(pub.name === "api", "name in public")
assert(pub.image === "nginx:1", "image in public")
assert(pub.replicas === 2, "replicas in public")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
