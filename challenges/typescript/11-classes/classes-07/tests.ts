import { Repository } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

interface Service { id: string; name: string; port: number }

const repo = new Repository<Service>()
assert(repo.count() === 0, "starts empty")
assert(repo.findAll().length === 0, "findAll empty")

repo.save({ id: "s1", name: "api", port: 8080 })
repo.save({ id: "s2", name: "db", port: 5432 })
assert(repo.count() === 2, "count after 2 saves")

const found = repo.findById("s1")
assert(found?.name === "api", "findById returns correct entity")
assert(repo.findById("nope") === undefined, "findById returns undefined for missing")

repo.save({ id: "s1", name: "api-v2", port: 9090 })
assert(repo.count() === 2, "overwriting same id keeps count")
assert(repo.findById("s1")?.name === "api-v2", "save overwrites existing entity")

const all = repo.findAll()
assert(all.length === 2, "findAll returns all entities")
assert(all.some(s => s.id === "s2"), "findAll includes s2")

assert(repo.delete("s2") === true, "delete returns true for existing")
assert(repo.count() === 1, "count after delete")
assert(repo.delete("nope") === false, "delete returns false for missing")

interface User { id: string; email: string }
const userRepo = new Repository<User>()
userRepo.save({ id: "u1", email: "a@b.com" })
assert(userRepo.findById("u1")?.email === "a@b.com", "works with different entity type")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
