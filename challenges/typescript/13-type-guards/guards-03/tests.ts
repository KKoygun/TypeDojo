import { isCircle, isRectangle, area, assertShape, Shape } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (no throw)`); failed++ } catch { passed++ }
}

const circle: Shape = { kind: 'circle', radius: 5 }
const rect: Shape = { kind: 'rectangle', width: 4, height: 6 }
const tri: Shape = { kind: 'triangle', base: 3, height: 8 }

assert(isCircle(circle) === true, "isCircle true for circle")
assert(isCircle(rect) === false, "isCircle false for rectangle")
assert(isCircle(null) === false, "isCircle false for null")
assert(isCircle(42) === false, "isCircle false for number")

assert(isRectangle(rect) === true, "isRectangle true")
assert(isRectangle(circle) === false, "isRectangle false for circle")

const circleArea = area(circle)
assert(Math.abs(circleArea - Math.PI * 25) < 0.001, "circle area π*r²")
assert(area(rect) === 24, "rectangle area w*h")
assert(area(tri) === 12, "triangle area 0.5*b*h")

assertShape({ kind: 'circle', radius: 1 })
assertShape({ kind: 'rectangle', width: 1, height: 1 })
assertShape({ kind: 'triangle', base: 1, height: 1 })
assertThrows(() => assertShape({ kind: 'hexagon' }), "assertShape throws on unknown kind")
assertThrows(() => assertShape(null), "assertShape throws on null")
assertThrows(() => assertShape("string"), "assertShape throws on string")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
