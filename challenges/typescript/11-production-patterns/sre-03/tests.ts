import { retry, delay, RetryOptions } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

async function main() {
  // delay works
  const start1 = Date.now()
  await delay(30)
  assert(Date.now() - start1 >= 25, "delay resolves after ms")

  // succeeds on first try
  const result = await retry(async () => 42, { maxAttempts: 3, baseDelayMs: 10, multiplier: 2 })
  assert(result === 42, "returns value on success")

  // retries and eventually succeeds
  let attempts = 0
  const result2 = await retry(async () => {
    attempts++
    if (attempts < 3) throw new Error("not yet")
    return "done"
  }, { maxAttempts: 5, baseDelayMs: 5, multiplier: 1 })
  assert(result2 === "done", "succeeds after retries")
  assert(attempts === 3, "called fn correct number of times")

  // exhausts retries and throws
  let threw = false
  let lastErr = ""
  try {
    await retry(async () => { throw new Error("always fails") }, { maxAttempts: 3, baseDelayMs: 5, multiplier: 1 })
  } catch (e) {
    threw = true
    lastErr = e instanceof Error ? e.message : ""
  }
  assert(threw, "throws after exhausting retries")
  assert(lastErr === "always fails", "throws last error")

  if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
  else console.log(`  ${passed} test(s) passed`)
}

main()
