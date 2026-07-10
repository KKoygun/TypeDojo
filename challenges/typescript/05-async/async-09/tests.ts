import { withTiming, runPipeline } from "./solution"

let passed = 0
let failed = 0

async function run() {
  const r = await withTiming(async () => 42)
  if (r.data === 42) { passed++ } else { console.error(`  FAIL [withTiming data]: ${r.data}`); failed++ }
  if (r.error === null) { passed++ } else { console.error(`  FAIL [withTiming error]: ${r.error}`); failed++ }
  if (typeof r.duration === "number" && r.duration >= 0) { passed++ } else { console.error(`  FAIL [withTiming duration]: ${r.duration}`); failed++ }

  const r2 = await withTiming(async () => { throw new Error("boom") })
  if (r2.data === null) { passed++ } else { console.error(`  FAIL [withTiming error data]: ${r2.data}`); failed++ }
  if (r2.error === "boom") { passed++ } else { console.error(`  FAIL [withTiming error msg]: ${r2.error}`); failed++ }

  const r3 = await runPipeline([1, 2, 3, 4])
  if (JSON.stringify(r3.data) === JSON.stringify([2, 4, 6, 8])) { passed++ } else { console.error(`  FAIL [pipeline data]: ${JSON.stringify(r3.data)}`); failed++ }
  if (r3.error === null) { passed++ } else { console.error(`  FAIL [pipeline error]: ${r3.error}`); failed++ }

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

run()
