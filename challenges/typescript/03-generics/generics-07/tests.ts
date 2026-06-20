import { pluck } from "./solution"

let passed = 0
let failed = 0

function assert(condition: boolean, label: string): void {
  if (condition) { passed++ }
  else { console.error(`  FAIL: ${label}`); failed++ }
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

const services = [
  { name: "api", port: 8080 },
  { name: "db", port: 5432 },
  { name: "cache", port: 6379 },
]

assert(deepEqual(pluck(services, "name"), ["api", "db", "cache"]), "pluck names")
assert(deepEqual(pluck(services, "port"), [8080, 5432, 6379]), "pluck ports")
assert(deepEqual(pluck([], "name"), []), "empty array")
assert(deepEqual(pluck([{ id: "x" }], "id"), ["x"]), "single item")

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
