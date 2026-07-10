import { getDirection } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown) {
  if (got === expected) { console.log(`  PASS  ${label}`); passed++ }
  else { console.error(`  FAIL  ${label}: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`); failed++ }
}

check("0 degrees → north",   getDirection(0),   "north")
check("45 degrees → north",  getDirection(45),  "north")
check("90 degrees → east",   getDirection(90),  "east")
check("135 degrees → east",  getDirection(135), "east")
check("180 degrees → south", getDirection(180), "south")
check("225 degrees → south", getDirection(225), "south")
check("270 degrees → west",  getDirection(270), "west")
check("315 degrees → west",  getDirection(315), "west")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`\n  ${passed} test(s) passed`)
