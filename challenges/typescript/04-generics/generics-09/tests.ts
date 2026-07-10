import { createRepository } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown): void {
  if (JSON.stringify(got) === JSON.stringify(expected)) {
    passed++
  } else {
    console.error(`  FAIL [${label}]: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`)
    failed++
  }
}

type User = { id: string; name: string }
const repo = createRepository<User>()

check("findAll empty", repo.findAll(), [])
check("findById missing", repo.findById("1"), undefined)

repo.save({ id: "1", name: "Alice" })
repo.save({ id: "2", name: "Bob" })

check("findById found", repo.findById("1"), { id: "1", name: "Alice" })
check("findAll count", repo.findAll().length, 2)

repo.save({ id: "1", name: "Alice Updated" })
check("save overwrites", repo.findById("1"), { id: "1", name: "Alice Updated" })

check("delete returns true", repo.delete("2"), true)
check("delete returns false", repo.delete("999"), false)
check("findAll after delete", repo.findAll().length, 1)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
