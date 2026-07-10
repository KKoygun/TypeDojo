import { runPipeline, formatPipeline } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

const runner = async (stage: string) => ({ output: `${stage} done` })

// successful pipeline
const result = await runPipeline(['build', 'test', 'deploy'], runner as any)
ok(result.success === true, "successful pipeline")
ok(result.stages.length === 3, "3 stages")
ok(result.stages.every(s => s.status === 'passed'), "all stages passed")
ok(result.totalMs >= 0, "totalMs is a number")

// failing pipeline stops early
let called: string[] = []
const failRunner = async (stage: string) => {
  called.push(stage)
  if (stage === 'test') throw new Error("tests failed")
  return { output: "ok" }
}
const failed = await runPipeline(['build', 'test', 'deploy', 'verify'], failRunner as any)
ok(failed.success === false, "pipeline failed")
ok(called.length === 2, "stopped after failure")
ok(failed.stages[1]?.status === 'failed', "test stage is failed")
ok(failed.stages[2]?.status === 'pending', "deploy stage is pending")
ok(failed.stages[3]?.status === 'pending', "verify stage is pending")

// formatPipeline
const fmt = formatPipeline(result)
ok(fmt.includes("passed"), "format includes passed")
ok(fmt.includes("build"), "format includes build")
ok(fmt.includes("✓"), "format includes checkmark")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
