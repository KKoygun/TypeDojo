import "dotenv/config"
import chalk from "chalk"
import * as path from "path"
import * as fs from "fs"
import { loadCurriculum } from "../curriculum"
import { Challenge } from "../types"
import { runCheck } from "./checkChallenge"

function findChallenge(id: string): Challenge | null {
  const curriculum = loadCurriculum()
  for (const topic of curriculum) {
    const found = topic.challenges.find((c) => c.id === id)
    if (found) return found
  }
  return null
}

async function main(): Promise<void> {
  const challengeId = process.argv[2]
  if (!challengeId) {
    console.log(chalk.red("Usage: npm run check <challenge-id>"))
    process.exit(1)
  }

  const challenge = findChallenge(challengeId)
  if (!challenge) {
    console.log(chalk.red(`Challenge "${challengeId}" not found.`))
    process.exit(1)
  }

  const challengeDir = path.join(__dirname, "../../challenges/typescript", challenge.topic, challengeId)
  const solutionPath = path.join(challengeDir, "solution.ts")

  if (!fs.existsSync(solutionPath)) {
    console.log(chalk.red(`No solution file found. Run 'npm run learn' and select this challenge first.`))
    process.exit(1)
  }

  await runCheck(challenge)
}

main().catch(console.error)
