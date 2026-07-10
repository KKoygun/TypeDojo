import { makeCounter, makeOnce } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown): void {
  if (got === expected) {
    passed++
  } else {
    console.error(`  FAIL [${label}]: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`)
    failed++
  }
}

// makeCounter
const c = makeCounter(5)
check("initial value", c.value(), 5)
c.increment()
check("after increment", c.value(), 6)
c.increment()
check("after second increment", c.value(), 7)
c.decrement()
check("after decrement", c.value(), 6)
c.reset()
check("after reset", c.value(), 5)
c.decrement()
check("below initial", c.value(), 4)

// two counters are independent
const a = makeCounter(0)
const b = makeCounter(100)
a.increment()
check("counter A independent", a.value(), 1)
check("counter B unaffected", b.value(), 100)

// makeOnce — fn is only called on the first invocation
let callCount = 0
const getSecret = makeOnce(() => {
  callCount++
  return 42
})
check("first call returns value", getSecret(), 42)
check("second call returns cached", getSecret(), 42)
check("third call returns cached", getSecret(), 42)
check("fn only called once", callCount, 1)

// two makeOnce instances are independent
let countA = 0
const onceA = makeOnce(() => { countA++; return "hello" })
const onceB = makeOnce(() => "world")
check("onceA returns correct value", onceA(), "hello")
check("onceA cached on repeat", onceA(), "hello")
check("onceB independent", onceB(), "world")
check("onceA fn called exactly once", countA, 1)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
