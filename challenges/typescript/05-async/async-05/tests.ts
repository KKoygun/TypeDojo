import { fetchName, fetchAge, fetchRole, fetchAll } from "./solution"

let passed = 0
let failed = 0

async function run() {
  const name = await fetchName()
  if (name === "Alice") { passed++ } else { console.error(`  FAIL [fetchName]: "${name}"`); failed++ }

  const age = await fetchAge()
  if (age === 30) { passed++ } else { console.error(`  FAIL [fetchAge]: ${age}`); failed++ }

  const role = await fetchRole()
  if (role === "admin") { passed++ } else { console.error(`  FAIL [fetchRole]: "${role}"`); failed++ }

  const all = await fetchAll()
  if (all === "Alice, 30, admin") { passed++ } else { console.error(`  FAIL [fetchAll]: "${all}"`); failed++ }

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

run()
