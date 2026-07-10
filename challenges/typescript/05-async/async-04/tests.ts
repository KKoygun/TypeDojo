import { fetchNumber, doubleAsync, pipeline } from "./solution"

let passed = 0
let failed = 0

async function run() {
  const n = await fetchNumber()
  if (n === 42) { passed++ } else { console.error(`  FAIL [fetchNumber]: ${n}`); failed++ }

  const d = await doubleAsync(5)
  if (d === 10) { passed++ } else { console.error(`  FAIL [doubleAsync 5]: ${d}`); failed++ }

  const d2 = await doubleAsync(21)
  if (d2 === 42) { passed++ } else { console.error(`  FAIL [doubleAsync 21]: ${d2}`); failed++ }

  const result = await pipeline()
  if (result === "Result: 84") { passed++ } else { console.error(`  FAIL [pipeline]: "${result}"`); failed++ }

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

run()
