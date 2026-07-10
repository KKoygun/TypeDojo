import { makePoint, movePoint, mergeSettings } from "./solution"

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

check("makePoint 1 2", makePoint(1, 2), { x: 1, y: 2 })
check("makePoint 0 0", makePoint(0, 0), { x: 0, y: 0 })
check("makePoint -3 5", makePoint(-3, 5), { x: -3, y: 5 })

const p = makePoint(2, 3)
const moved = movePoint(p, 1, -1)
check("movePoint result", moved, { x: 3, y: 2 })
check("movePoint original unchanged", p, { x: 2, y: 3 })

check("merge no conflict", mergeSettings({ a: "1" }, { b: "2" }), { a: "1", b: "2" })
check("merge override wins", mergeSettings({ a: "1", b: "2" }, { b: "99" }), { a: "1", b: "99" })
check("merge empty overrides", mergeSettings({ a: "1" }, {}), { a: "1" })

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
