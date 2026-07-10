import { processSequential, processParallel } from "./solution"

let passed = 0
let failed = 0

async function run() {
  const s = await processSequential([1, 2, 3, 4])
  if (JSON.stringify(s) === JSON.stringify([2, 4, 6, 8])) { passed++ } else { console.error(`  FAIL [sequential]: ${JSON.stringify(s)}`); failed++ }

  const s2 = await processSequential([])
  if (JSON.stringify(s2) === JSON.stringify([])) { passed++ } else { console.error(`  FAIL [sequential empty]: ${JSON.stringify(s2)}`); failed++ }

  const p = await processParallel([1, 2, 3, 4])
  if (JSON.stringify(p) === JSON.stringify([2, 4, 6, 8])) { passed++ } else { console.error(`  FAIL [parallel]: ${JSON.stringify(p)}`); failed++ }

  const p2 = await processParallel([5])
  if (JSON.stringify(p2) === JSON.stringify([10])) { passed++ } else { console.error(`  FAIL [parallel single]: ${JSON.stringify(p2)}`); failed++ }

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

run()
