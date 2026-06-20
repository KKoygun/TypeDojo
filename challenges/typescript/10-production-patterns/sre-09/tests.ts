import { runPipeline, formatPipeline, Stage } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

async function main() {
  // all pass
  const result1 = await runPipeline(
    ["build", "test", "deploy"],
    async (stage) => ({ output: `${stage} ok` })
  )
  assert(result1.success === true, "all pass → success=true")
  assert(result1.stages.length === 3, "all stages present")
  assert(result1.stages.every(s => s.status === "passed"), "all stages passed")
  assert(result1.stages[0]!.output === "build ok", "output captured")
  assert(result1.totalMs >= 0, "totalMs is set")

  // fail on deploy
  const result2 = await runPipeline(
    ["build", "test", "deploy", "verify"],
    async (stage) => {
      if (stage === "deploy") throw new Error("deploy failed")
      return { output: `${stage} ok` }
    }
  )
  assert(result2.success === false, "failure → success=false")
  assert(result2.stages[0]!.status === "passed", "build passed")
  assert(result2.stages[1]!.status === "passed", "test passed")
  assert(result2.stages[2]!.status === "failed", "deploy failed")
  assert(result2.stages[3]!.status === "pending", "verify pending")

  // formatPipeline
  const fmt = formatPipeline(result2)
  assert(fmt.startsWith("Pipeline: failed"), "format starts with failed")
  assert(fmt.includes("✓ build"), "build shows checkmark")
  assert(fmt.includes("✗ deploy"), "deploy shows x")
  assert(fmt.includes("- verify"), "verify shows pending dash")

  if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
  else console.log(`  ${passed} test(s) passed`)
}

main()
