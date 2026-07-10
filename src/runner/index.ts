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
const shownConcepts = new Set<string>()

function clearScreen(): void {
  process.stdout.write("\x1b[2J\x1b[3J\x1b[H")
}

interface ConceptSection {
  title: string
  lines: string[]
}

function parseConceptSections(raw: string): { intro: string[]; sections: ConceptSection[] } {
  const lines = raw.split("\n")
  const intro: string[] = []
  const sections: ConceptSection[] = []
  let current: ConceptSection | null = null
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current)
      current = { title: line.slice(3).trim(), lines: [] }
    } else if (current) {
      current.lines.push(line)
    } else {
      intro.push(line)
    }
  }
  if (current) sections.push(current)
  return { intro, sections }
}

function renderConceptLines(lines: string[]): void {
  let inCode = false
  for (const line of lines) {
    if (line.startsWith("```")) { inCode = !inCode; continue }
    if (inCode) {
      console.log(chalk.green("    " + line))
    } else if (line.startsWith("# ")) {
      console.log(chalk.bold.cyan("  " + line.slice(2)))
    } else if (line.startsWith("## ")) {
      console.log(chalk.yellow("\n  " + line.slice(3)))
    } else if (line.startsWith("---")) {
      console.log(chalk.dim("  " + "─".repeat(56)))
    } else {
      console.log(chalk.white("  " + line))
    }
  }
}

async function showConcept(topicId: string): Promise<void> {
  const conceptPath = path.join(__dirname, "../../challenges/typescript", topicId, "concept.md")
  if (!fs.existsSync(conceptPath)) {
    console.log(chalk.dim("\n  No concept card available for this topic yet.\n"))
    await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to go back...") }])
    return
  }

  const { intro, sections } = parseConceptSections(fs.readFileSync(conceptPath, "utf-8"))

  while (true) {
    clearScreen()
    console.log()
    renderConceptLines(intro)
    console.log()

    const { selected } = await inquirer.prompt([{
      type: "list",
      name: "selected",
      message: "Jump to a section:",
      choices: [...sections.map(s => s.title), chalk.dim("← Back")],
      pageSize: 20,
    }])

    if (selected === chalk.dim("← Back")) return

    const section = sections.find(s => s.title === selected)
    if (!section) return

    clearScreen()
    console.log()
    console.log(chalk.yellow("  " + section.title))
    renderConceptLines(section.lines)
    console.log()
    await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to go back to sections...") }])
  }
}

async function runTerminalChallenge(c: Challenge, lastHint?: string, hintIndex = 0): Promise<void> {
  clearScreen()
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
    if (action === "Try again") return runTerminalChallenge(c, lastHint, hintIndex)
    if (action === "Show hint") {
      const hint = c.hints[hintIndex] ?? "No more hints available."
      return runTerminalChallenge(c, hint, Math.min(hintIndex + 1, c.hints.length))
    }
    if (action === "Skip") markComplete(c.id, "skip")
  }
}

async function runFileChallenge(c: Challenge, hintIndex = 0): Promise<void> {
  const challengeDir = path.join(__dirname, "../../challenges/typescript", c.topic, c.id)
  const solutionPath = path.join(challengeDir, "solution.ts")
  const templatePath = path.join(challengeDir, "template.ts")
  const relativePath = `challenges/typescript/${c.topic}/${c.id}/solution.ts`

  const isNew = !fs.existsSync(solutionPath)
  if (isNew && fs.existsSync(templatePath)) {
    fs.copyFileSync(templatePath, solutionPath)
  }

  clearScreen()
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
    const p = loadProgress()
    if (!p.seenAutoSaveTip) {
      p.seenAutoSaveTip = true
      saveProgress(p)
      console.log(chalk.dim("\n  Tip: enable autosave in VS Code (File → Auto Save) so you never need to"))
      console.log(chalk.dim("  manually save before running check."))
    }
  } else {
    console.log(chalk.dim(`  → ${relativePath}`))
  }
  console.log()

  const conceptPath = path.join(__dirname, "../../challenges/typescript", c.topic, "concept.md")
  const hasConceptCard = fs.existsSync(conceptPath)
  const menuChoices = [
    "Run check",
    "Show hint",
    ...(hasConceptCard ? ["View concept"] : []),
    ...(ai ? ["Ask AI"] : []),
    "Back",
  ]

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: menuChoices,
    },
  ])

  if (action === "Run check") {
    const result = await runCheck(c)
    if (result === "retry" || result === "fail") {
      return runFileChallenge(c, hintIndex)
    }
    await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to continue...") }])
  } else if (action === "Show hint") {
    const hint = c.hints[hintIndex] ?? "No more hints available."
    console.log()
    console.log(chalk.magenta("  Hint: ") + chalk.white(hint))
    console.log()
    await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to go back to the challenge...") }])
    return runFileChallenge(c, Math.min(hintIndex + 1, c.hints.length))
  } else if (action === "View concept") {
    await showConcept(c.topic)
    return runFileChallenge(c, hintIndex)
  } else if (action === "Ask AI") {
    console.log()
    const { question } = await inquirer.prompt([
      { type: "input", name: "question", message: chalk.cyan("  Your question:") },
    ])
    if (question.trim()) {
      try {
        const code = fs.existsSync(solutionPath) ? fs.readFileSync(solutionPath, "utf-8") : ""
        const answer = await ai!.ask(question.trim(), code, c.description)
        console.log(chalk.white(`\n  ${answer}\n`))
      } catch (e: any) {
        console.log(chalk.red(`\n  AI error: ${e.message}\n`))
      }
      await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to go back...") }])
    }
    return runFileChallenge(c, hintIndex)
  }
}

async function selectTopic(curriculum: TopicMeta[]): Promise<TopicMeta | null> {
  clearScreen()
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

  // Show concept card once per topic per session
  if (!shownConcepts.has(topic.id)) {
    const conceptPath = path.join(__dirname, "../../challenges/typescript", topic.id, "concept.md")
    if (fs.existsSync(conceptPath)) {
      shownConcepts.add(topic.id)
      await showConcept(topic.id)
    }
  }

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

  const conceptPath = path.join(__dirname, "../../challenges/typescript", topic.id, "concept.md")
  if (fs.existsSync(conceptPath)) {
    choices.push({ name: chalk.cyan("  📖 View concept card"), value: "concept" as any })
  }
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

  if (selected === "concept") {
    await showConcept(topic.id)
    return await selectChallenge(curriculum)
  }

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
    new:         [],
    basics:      allTopicIds.slice(1, 4),   // 02-04 (skip 01-javascript-essentials)
    comfortable: allTopicIds.slice(1, 11),  // 02-11 (skip 01-javascript-essentials)
    advanced:    allTopicIds,               // all topics
  }

  console.log(chalk.dim("  Your answer unlocks topic entry points so you can start where it makes sense.\n"))

  const { level } = await inquirer.prompt([
    {
      type: "list",
      name: "level",
      message: "How comfortable are you with TypeScript?",
      choices: [
        { name: "New to it — start with TypeScript Essentials", value: "new" },
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
  await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to continue...") }])
}

async function main(): Promise<void> {
  clearScreen()
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

  console.log(chalk.dim("  Tip: run 'npm run map' to see your full progress tree\n"))

  const p = loadProgress()
  if (!p.startingLevel) {
    await runOnboarding(curriculum)
  }

  // Resume where you left off
  if (p.lastSeen) {
    const allIds = allChallengeIds(curriculum)
    const allChallenges = curriculum.flatMap(t => t.challenges)
    const lastIdx = allIds.indexOf(p.lastSeen)
    const nextId = allIds[lastIdx + 1]
    const lastChallenge = allChallenges.find(c => c.id === p.lastSeen)
    const nextChallenge = nextId ? allChallenges.find(c => c.id === nextId) : undefined

    if (lastChallenge) {
      console.log(chalk.dim(`  Last completed: ${lastChallenge.title}`))
      console.log()
      if (nextChallenge) {
        const { resume } = await inquirer.prompt([{
          type: "list",
          name: "resume",
          message: `Next up: "${nextChallenge.title}" — jump straight in?`,
          choices: ["Yes, let's go", "No, show me all topics"],
        }])
        if (resume === "Yes, let's go") {
          if (nextChallenge.type === "terminal") {
            await runTerminalChallenge(nextChallenge)
          } else {
            await runFileChallenge(nextChallenge)
          }
        }
      } else {
        console.log(chalk.green("  You've worked through all available challenges!\n"))
      }
    }
  }

  await selectChallenge(curriculum)
}

main().catch(console.error)
