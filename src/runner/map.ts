import chalk from "chalk"
import { loadCurriculum, allChallengeIds, isPreview, statusSummary } from "../curriculum"
import { loadProgress, isUnlocked } from "../progress"

function main(): void {
  const curriculum = loadCurriculum()
  const progress = loadProgress()
  const allIds = allChallengeIds(curriculum)

  console.log()
  console.log(chalk.bold.blue("  TypeScript Quest · Progress Map"))
  console.log()

  for (const topic of curriculum) {
    const preview = isPreview(topic) ? chalk.magenta("  [preview]") : ""
    console.log(chalk.bold(`  ${topic.title}`) + preview)
    for (const c of topic.challenges) {
      const unlocked = isUnlocked(c.id, allIds, progress, { topic: topic.id })
      const done = progress.completed[c.id]
      const icon =
        done === "pass" ? chalk.green("✓") :
        done === "skip" ? chalk.yellow("↻") :
        unlocked ? chalk.white("○") :
        chalk.dim("🔒")
      const typeTag = c.type === "file" ? chalk.dim("[file]") : chalk.dim("[q&a] ")
      const line = `    ${icon}  L${c.level} ${typeTag} ${c.title}`
      console.log(unlocked ? line : chalk.dim(line))
    }
    console.log()
  }

  const total = allIds.length
  const passed = Object.values(progress.completed).filter((v) => v === "pass").length
  const skipped = Object.values(progress.completed).filter((v) => v === "skip").length
  const { validated, draft } = statusSummary(curriculum)
  console.log(chalk.dim(`  ${passed}/${total} passed · ${skipped} skipped · ${progress.insightsUsed} AI insights used`))
  console.log(chalk.dim(`  Validated: ${validated.challenges} challenges in ${validated.topics} topics · Preview: ${draft.challenges} challenges in ${draft.topics} topics\n`))
}

main()
