import { delay, greetAfterDelay } from "./solution"

let passed = 0
let failed = 0

async function run() {
  const start = Date.now()
  await delay(50)
  const elapsed = Date.now() - start
  if (elapsed >= 45) {
    passed++
  } else {
    console.error(`  FAIL [delay timing]: elapsed ${elapsed}ms, expected >= 45ms`)
    failed++
  }

  const msg = await greetAfterDelay("Alice", 10)
  if (msg === "Hello, Alice!") {
    passed++
  } else {
    console.error(`  FAIL [greetAfterDelay]: got "${msg}", expected "Hello, Alice!"`)
    failed++
  }

  const msg2 = await greetAfterDelay("TypeScript", 10)
  if (msg2 === "Hello, TypeScript!") {
    passed++
  } else {
    console.error(`  FAIL [greetAfterDelay-2]: got "${msg2}", expected "Hello, TypeScript!"`)
    failed++
  }

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

run()
