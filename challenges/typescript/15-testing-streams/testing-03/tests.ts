import { createMock } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

// basic recording
const add = createMock((a: number, b: number) => a + b)
assert(add(1, 2) === 3, "calls impl and returns result")
assert(add(5, 5) === 10, "second call")
assert(add.calls.length === 2, "records 2 calls")
assert(JSON.stringify(add.calls[0]) === JSON.stringify([1, 2]), "records first call args")
assert(add.returnValues[0] === 3, "records first return value")
assert(add.returnValues[1] === 10, "records second return value")

// mockReturnValue
add.mockReturnValue(99)
assert(add(1, 2) === 99, "mockReturnValue overrides impl")
assert(add(5, 5) === 99, "mockReturnValue persists")
assert(add.calls.length === 4, "still records calls after override")

// reset
add.reset()
assert(add.calls.length === 0, "reset clears calls")
assert(add.returnValues.length === 0, "reset clears returnValues")
assert(add(3, 4) === 7, "reset restores impl")

// no impl
const noImpl = createMock<() => void>()
noImpl()
assert(noImpl.calls.length === 1, "no-impl mock records calls")

noImpl.mockReturnValue(undefined)
noImpl()
assert(noImpl.calls.length === 2, "no-impl with mockReturnValue still works")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
