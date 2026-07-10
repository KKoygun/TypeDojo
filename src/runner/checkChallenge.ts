import chalk from "chalk"
import * as fs from "fs"
import * as path from "path"
import { execSync } from "child_process"
import inquirer from "inquirer"
import { loadProgress, saveProgress, markComplete } from "../progress"
import { createAIProvider } from "../ai"
import { Challenge } from "../types"

const ai = createAIProvider()

function cleanError(raw: string): string {
  return raw
    .split("\n")
    .filter(l => /error TS\d+/.test(l) || (l.trim().startsWith("error") && !l.includes("node_modules")))
    .map(l => "  " + l.trim())
    .join("\n")
}

export function compileCheck(solutionPath: string): { ok: boolean; output: string } {
  try {
    execSync(`npx ts-node ${solutionPath}`, { encoding: "utf-8", stdio: "pipe" })
    return { ok: true, output: "" }
  } catch (e: any) {
    const raw = ((e.stdout ?? "") + (e.stderr ?? "")) || (e.message ?? "")
    return { ok: false, output: cleanError(raw) || raw.split("\n").filter((l: string) => l.trim() && !l.includes("node_modules")).slice(0, 3).join("\n") }
  }
}

function formatTestOutput(raw: string): string {
  return raw
    .split("\n")
    .map(line => {
      const m = line.match(/^(\s*FAIL:[^→]+)→\s*(".*?")\s*\(expected\s*(".*?")\)/)
      if (m) {
        const pad = " ".repeat(m[1]!.replace(/\S.*/, "").length + 6)
        return `${m[1]!.trimEnd()}\n${pad}got:      ${m[2]}\n${pad}expected: ${m[3]}`
      }
      return line
    })
    .join("\n")
}

export function runTests(testFile: string, solutionPath: string): { ok: boolean; output: string } {
  try {
    const output = execSync(`ts-node ${testFile}`, {
      encoding: "utf-8",
      stdio: "pipe",
      env: { ...process.env, SOLUTION_PATH: solutionPath },
    })
    return { ok: true, output }
  } catch (e: any) {
    const raw = ((e.stdout ?? "") + (e.stderr ?? "")) || (e.message ?? "")
    const cleaned = cleanError(raw)
    const testOut = formatTestOutput(raw.split("\n").filter((l: string) => !l.includes("node_modules") && l.trim()).join("\n"))
    return { ok: false, output: cleaned || testOut }
  }
}

async function offerInsight(challenge: Challenge, solutionPath: string, errorOutput: string): Promise<"retry" | "done" | "skip"> {
  const baseChoices = ai
    ? ["Try again", "Get AI insight", "Show hint", "Skip"]
    : ["Try again", "Show hint", "Skip"]

  const { action } = await inquirer.prompt([
    { type: "list", name: "action", message: "What next?", choices: baseChoices },
  ])

  if (action === "Try again") return "retry"
  if (action === "Skip") return "skip"

  if (action === "Get AI insight") {
    const code = fs.readFileSync(solutionPath, "utf-8")
    const hasCode = code.replace(/\/\/.*$/gm, "").replace(/\s/g, "").length > 50
    if (!hasCode) {
      console.log(chalk.yellow("\n  Write some code first — AI insight works best when there's an actual attempt to review.\n"))
      await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to continue...") }])
      return "done"
    }
    process.stdout.write("  Getting insight... ")
    try {
      const insight = await ai!.insight(challenge.description, code, errorOutput)
      const p = loadProgress()
      p.insightsUsed++
      saveProgress(p)
      console.log(chalk.yellow(`\n  ${insight}\n`))
    } catch (e: any) {
      console.log(chalk.red(`\n  AI error: ${e.message}\n`))
    }
    await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to continue...") }])
  } else if (action === "Show hint") {
    console.log(chalk.magenta("\n  Hint: ") + chalk.white(challenge.hints[0] ?? "No hints available.") + "\n")
    await inquirer.prompt([{ type: "input", name: "_", message: chalk.dim("Press Enter to continue...") }])
  }

  return "done"
}

export async function runCheck(challenge: Challenge): Promise<"pass" | "fail" | "skip" | "retry"> {
  const challengeDir = path.join(__dirname, "../../challenges/typescript", challenge.topic, challenge.id)
  const solutionPath = path.join(challengeDir, "solution.ts")
  const testFile = path.join(challengeDir, "tests.ts")

  console.log()
  console.log(chalk.bold(`  Checking: ${challenge.title}`))
  console.log()

  // Warn if solution is unchanged from template
  const templatePath = path.join(challengeDir, "template.ts")
  if (fs.existsSync(templatePath) && fs.existsSync(solutionPath)) {
    const template = fs.readFileSync(templatePath, "utf-8")
    const solution = fs.readFileSync(solutionPath, "utf-8")
    if (template === solution) {
      console.log(chalk.yellow("  ⚠  Your solution looks unchanged from the template."))
      console.log(chalk.dim("     Did you forget to save? (VS Code: File → Auto Save)\n"))
      const { proceed } = await inquirer.prompt([{
        type: "list", name: "proceed", message: "Run check anyway?",
        choices: ["Yes, run it", "No, go back and edit"],
      }])
      if (proceed !== "Yes, run it") return "retry"
      console.log()
    }
  }

  // Step 1: compile
  process.stdout.write("  TypeScript compile... ")
  const compile = compileCheck(solutionPath)
  if (!compile.ok) {
    console.log(chalk.red("✗"))
    console.log(chalk.dim(compile.output))
    const next = await offerInsight(challenge, solutionPath, compile.output)
    if (next === "retry") return "retry"
    if (next === "skip") { markComplete(challenge.id, "skip"); return "skip" }
    return "fail"
  }
  console.log(chalk.green("✓"))

  // Step 2: tests
  if (fs.existsSync(testFile)) {
    process.stdout.write("  Test cases... ")
    const tests = runTests(testFile, solutionPath)
    if (!tests.ok) {
      console.log(chalk.red("✗"))
      console.log(chalk.dim(tests.output))
      const next = await offerInsight(challenge, solutionPath, tests.output)
      if (next === "retry") return "retry"
      if (next === "skip") { markComplete(challenge.id, "skip"); return "skip" }
      return "fail"
    }
    console.log(chalk.green("✓"))
  }

  // Step 3: AI approach evaluation
  if (ai) {
    process.stdout.write("  Evaluating approach... ")
    const code = fs.readFileSync(solutionPath, "utf-8")
    const result = await ai.evaluate(challenge.description, code)
    if (!result.pass) {
      console.log(chalk.red("✗"))
      console.log(chalk.yellow(`\n  ${result.feedback}\n`))
      const next = await offerInsight(challenge, solutionPath, result.feedback)
      if (next === "retry") return "retry"
      if (next === "skip") { markComplete(challenge.id, "skip"); return "skip" }
      return "fail"
    }
    console.log(chalk.green("✓"))
    console.log(chalk.dim(`\n  ${result.feedback}`))
  }

  console.log(chalk.green("\n  ✓ Challenge complete!\n"))
  markComplete(challenge.id, "pass")
  return "pass"
}
