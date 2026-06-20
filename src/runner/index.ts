import "dotenv/config"
import chalk from "chalk"
import inquirer from "inquirer"
import * as path from "path"
import * as fs from "fs"
import { loadCurriculum, allChallengeIds } from "../curriculum"
import { loadProgress, saveProgress, markComplete, isUnlocked } from "../progress"
import { runCheck } from "./checkChallenge"
import { Challenge, TopicMeta } from "../types"
import { createAIProvider } from "../ai"

const ai = createAIProvider()

async function runTerminalChallenge(c: Challenge, lastHint?: string): Promise<void> {
  console.clear()
  console.log()
  console.log(chalk.cyan(`  Challenge ${c.id} · ${c.title}`))
  console.log(chalk.dim(`  Difficulty L${c.level} · ${c.topic}`))
  console.log()
  const question = c.description.split("\n").filter(l => !/^\s*[A-D]\)/.test(l)).join("\n").trim()
  console.log(chalk.white(question))
  console.log()
  console.log(chalk.yellow(`  Why this matters: `) + chalk.dim(c.whyMatters))
  console.log()

  if (lastHint) {
    console.log(chalk.magenta(`  Hint: `) + chalk.white(lastHint))
    console.log()
  }

  if (!c.choices) return

  const { answer } = await inquirer.prompt([
    {
      type: "list",
      name: "answer",
      message: "Your answer:",
      choices: c.choices.map((ch, i) => {
          const letter = String.fromCharCode(65 + i)
          const text = ch.label.replace(/^[A-D]\)\s*/i, "")
          return { name: `${letter})  ${text}`, value: ch.label }
        }),
    },
  ])

  const chosen = c.choices.find((ch) => ch.label === answer)
  if (chosen?.correct) {
    markComplete(c.id, "pass")
    console.log(chalk.green("\n  ✓ Correct!\n"))
    const correctText = chosen.label.replace(/^[A-D]\)\s*/i, "")
    console.log(chalk.white(`  ${correctText}`))
    console.log()
    await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to continue...") }])
  } else {
    console.log(chalk.red("\n  ✗ Not quite.\n"))
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What next?",
        choices: ["Try again", "Show hint", "Skip"],
      },
    ])
    if (action === "Try again") return runTerminalChallenge(c, lastHint)
    if (action === "Show hint") {
      const hint = c.hints[0] ?? "No hints available."
      return runTerminalChallenge(c, hint)
    }
    if (action === "Skip") markComplete(c.id, "skip")
  }
}

async function runFileChallenge(c: Challenge): Promise<void> {
  const challengeDir = path.join(__dirname, "../../challenges/typescript", c.topic, c.id)
  const solutionPath = path.join(challengeDir, "solution.ts")
  const templatePath = path.join(challengeDir, "template.ts")
  const relativePath = `challenges/typescript/${c.topic}/${c.id}/solution.ts`

  const isNew = !fs.existsSync(solutionPath)
  if (isNew && fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, solutionPath)
  }

  console.clear()
  console.log()
  console.log(chalk.cyan(`  Challenge ${c.id} · ${c.title}`) + chalk.yellow("  ✎ coding"))
  console.log(chalk.dim(`  Difficulty L${c.level} · ${c.topic}`))
  console.log()
  console.log(chalk.white(c.description))
  console.log()
  console.log(chalk.yellow(`  Why this matters: `) + chalk.dim(c.whyMatters))
  console.log()

  if (isNew) {
    console.log(chalk.bgGreen.black("  ✎ solution.ts created  "))
    console.log(chalk.green(`  → ${relativePath}`))
    console.log(chalk.white("  Open it in your editor, write your solution, then come back and run check."))
  } else {
    console.log(chalk.dim(`  → ${relativePath}`))
  }
  console.log()

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["Run check", "Show hint", "Back"],
    },
  ])

  if (action === "Run check") {
    const result = await runCheck(c)
    if (result === "retry" || result === "fail") {
      return runFileChallenge(c)
    }
    await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to continue...") }])
  } else if (action === "Show hint") {
    console.log()
    console.log(chalk.magenta("  Hint: ") + chalk.white(c.hints[0] ?? "No hints available."))
    console.log()
    await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to go back to the challenge...") }])
    return runFileChallenge(c)
  }
}

async function selectTopic(curriculum: TopicMeta[]): Promise<TopicMeta | null> {
  console.clear()
  const progress = loadProgress()
  const allIds = allChallengeIds(curriculum)

  const choices = curriculum.map((topic) => {
    const total = topic.challenges.length
    const passed = topic.challenges.filter((c) => progress.completed[c.id] === "pass").length
    const skipped = topic.challenges.filter((c) => progress.completed[c.id] === "skip").length
    const firstUnlocked = isUnlocked(topic.challenges[0]!.id, allIds, progress, { topic: topic.id, isFirstInTopic: true })
    const locked = !firstUnlocked
    const done = passed === total
    const icon = done ? chalk.green("✓") : locked ? chalk.dim("🔒") : chalk.white("○")
    const stats = chalk.dim(`${passed}/${total}${skipped > 0 ? ` · ${skipped} skipped` : ""}`)
    const label = `${icon}  ${topic.title}  ${stats}`
    return { name: locked ? chalk.dim(label) : label, value: locked ? null : topic }
  })

  const { topic } = await inquirer.prompt([
    {
      type: "list",
      name: "topic",
      message: "Select a topic:",
      choices,
      pageSize: 20,
    },
  ])

  return topic
}

async function selectChallenge(curriculum: TopicMeta[]): Promise<void> {
  const topic = await selectTopic(curriculum)
  if (!topic) return await selectChallenge(curriculum)

  const progress = loadProgress()
  const allIds = allChallengeIds(curriculum)

  const choices: { name: string; value: Challenge | null }[] = topic.challenges.map((c, i) => {
    const unlocked = isUnlocked(c.id, allIds, progress, { topic: topic.id, isFirstInTopic: i === 0 })
    const done = progress.completed[c.id]
    const icon = done === "pass" ? chalk.green("✓") : done === "skip" ? chalk.yellow("↻") : unlocked ? chalk.white("○") : chalk.dim("🔒")
    const typeTag = c.type === "file" ? chalk.yellow(" ✎") : ""
    const label = `${icon}  #${i + 1} · ${c.title}${typeTag}  ${chalk.dim(`(L${c.level})`)}`
    return { name: unlocked ? label : chalk.dim(label), value: unlocked ? c : null }
  })

  choices.push({ name: chalk.dim("← Back to topics"), value: null })

  const { selected } = await inquirer.prompt([
    {
      type: "list",
      name: "selected",
      message: `${topic.title} — select a challenge:`,
      choices,
      pageSize: 20,
    },
  ])

  if (!selected) return await selectChallenge(curriculum)

  if (selected.type === "terminal") {
    await runTerminalChallenge(selected)
  } else {
    await runFileChallenge(selected)
  }

  await selectChallenge(curriculum)
}

async function runOnboarding(curriculum: TopicMeta[]): Promise<void> {
  const allTopicIds = curriculum.map((t) => t.id)

  const UNLOCK_MAP: Record<string, string[]> = {
    new:        [],
    basics:     allTopicIds.slice(0, 3),   // 01-03
    comfortable: allTopicIds.slice(0, 10), // 01-10
    advanced:   allTopicIds,               // all 18
  }

  console.log(chalk.dim("  Your answer unlocks topic entry points so you can start where it makes sense.\n"))

  const { level } = await inquirer.prompt([
    {
      type: "list",
      name: "level",
      message: "How comfortable are you with TypeScript?",
      choices: [
        { name: "New to it — start from the beginning", value: "new" },
        { name: "Know the basics — unlock Types, Interfaces, Generics", value: "basics" },
        { name: "Comfortable — unlock the first 10 topics", value: "comfortable" },
        { name: "Advanced — unlock all topics as entry points", value: "advanced" },
      ],
    },
  ])

  const unlocked = UNLOCK_MAP[level] ?? []
  const p = loadProgress()
  p.startingLevel = level
  p.unlockedTopics = unlocked
  saveProgress(p)

  const count = unlocked.length
  const msg = count === 0
    ? chalk.dim("\n  Starting from the beginning — good luck!\n")
    : chalk.dim(`\n  Unlocked ${count} topic entry points. Complete challenges within each to progress further.\n`)
  console.log(msg)
}

async function main(): Promise<void> {
  console.clear()
  console.log(chalk.bold.blue("\n  TypeDojo"))
  console.log(chalk.dim("  Terminal-based TypeScript curriculum\n"))

  const curriculum = loadCurriculum()
  if (curriculum.length === 0) {
    console.log(chalk.red("  No challenges found. Run from the typescript-game root directory."))
    process.exit(1)
  }

  if (!ai) {
    console.log(chalk.dim("  AI features disabled (set GEMINI_API_KEY to enable insights)\n"))
  }

  const p = loadProgress()
  if (!p.startingLevel) {
    await runOnboarding(curriculum)
  }

  await selectChallenge(curriculum)
}

main().catch(console.error)
