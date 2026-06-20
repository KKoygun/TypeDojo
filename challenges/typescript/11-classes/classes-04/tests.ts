import { ConnectionPool } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, msg: string, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (did not throw)`); failed++ }
  catch (e) { assert(e instanceof Error && e.message === msg, label) }
}

const pool = new ConnectionPool(3)
assert(pool.size === 0, "initial size is 0")
assert(pool.available === 3, "initial available is 3")

pool.add("conn-1")
pool.add("conn-2")
assert(pool.size === 2, "size after 2 adds")
assert(pool.available === 1, "available after 2 adds")

pool.add("conn-3")
assert(pool.size === 3, "size at capacity")
assert(pool.available === 0, "available at capacity")

assertThrows(() => pool.add("conn-4"), "Pool is full", "throws when full")

pool.remove("conn-2")
assert(pool.size === 2, "size after remove")
assert(pool.available === 1, "available after remove")

assertThrows(() => pool.remove("conn-99"), "Connection not found", "throws when not found")

const list = pool.list()
assert(Array.isArray(list), "list returns array")
assert(list.includes("conn-1"), "list contains conn-1")
assert(list.includes("conn-3"), "list contains conn-3")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
