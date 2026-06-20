import { delay, delayedGreeting } from "./solution"

let passed = 0
let failed = 0

async function assert(label: string, fn: () => Promise<boolean>): Promise<void> {
  try {
    const ok = await fn()
    if (ok) { passed++ }
    else { console.error(`  FAIL: ${label}`); failed++ }
  } catch (e) {
    console.error(`  FAIL [${label}]: threw ${e}`)
    failed++
  }
}

async function main() {
  await assert("delay resolves after ms", async () => {
    const start = Date.now()
    await delay(50)
    return Date.now() - start >= 40
  })

  await assert("delay returns void", async () => {
    const result = await delay(10)
    return result === undefined
  })

  await assert("delayedGreeting returns correct string", async () => {
    const result = await delayedGreeting("Alice", 10)
    return result === "Hello, Alice!"
  })

  await assert("delayedGreeting waits before resolving", async () => {
    const start = Date.now()
    await delayedGreeting("Bob", 50)
    return Date.now() - start >= 40
  })

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

main()
