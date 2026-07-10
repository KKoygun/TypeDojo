import { delay, retry } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

// delay
const t0 = Date.now()
await delay(50)
const elapsed = Date.now() - t0
ok(elapsed >= 40, "delay waits at least the given ms")

// retry succeeds on first try
const result1 = await retry(() => Promise.resolve(42), { maxAttempts: 3, baseDelayMs: 10, multiplier: 2 })
ok(result1 === 42, "retry returns value on success")

// retry eventually succeeds
let attempts = 0
const result2 = await retry(async () => {
  attempts++
  if (attempts < 3) throw new Error("not yet")
  return "done"
}, { maxAttempts: 5, baseDelayMs: 10, multiplier: 1 })
ok(result2 === "done", "retry succeeds after failures")
ok(attempts === 3, "retry called fn correct number of times")

// retry throws after maxAttempts
let threw = false
try {
  await retry(() => Promise.reject(new Error("always fails")), { maxAttempts: 3, baseDelayMs: 5, multiplier: 1 })
} catch (e: any) {
  threw = true
  ok(e.message === "always fails", "retry throws last error")
}
ok(threw, "retry throws after maxAttempts")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
