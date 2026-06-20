import { createEntity, withAudit, isAudited } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

const e = createEntity("e1")
ok(e.id === "e1", "id set")
ok(typeof e.createdAt === "string" && e.createdAt.includes("T"), "createdAt ISO string")
ok(typeof e.updatedAt === "string" && e.updatedAt.includes("T"), "updatedAt ISO string")
ok(isAudited(e) === false, "plain entity is not audited")

const a = withAudit(e, "alice")
ok(a.id === "e1", "id preserved in audited")
ok(a.createdBy === "alice", "createdBy set")
ok(a.updatedBy === "alice", "updatedBy set")
ok(a.createdAt === e.createdAt, "timestamps preserved")
ok(isAudited(a) === true, "audited entity is audited")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
