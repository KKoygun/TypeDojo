import * as fs from "fs"
import * as path from "path"
import { Progress } from "./types"

const DEFAULT_PROGRESS_FILE = path.join(__dirname, "../.progress.json")

// TYPEDOJO_PROGRESS_FILE lets tests use a scratch file instead of the learner's real progress
function progressFile(): string {
  return process.env.TYPEDOJO_PROGRESS_FILE ?? DEFAULT_PROGRESS_FILE
}

const defaultProgress = (): Progress => ({
  completed: {},
  insightsUsed: 0,
  lastSeen: "",
  unlockedTopics: [],
})

export function loadProgress(): Progress {
  const file = progressFile()
  if (!fs.existsSync(file)) return defaultProgress()
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"))
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(p: Progress): void {
  fs.writeFileSync(progressFile(), JSON.stringify(p, null, 2))
}

export function markComplete(id: string, result: "pass" | "skip"): void {
  const p = loadProgress()
  p.completed[id] = result
  p.lastSeen = id
  saveProgress(p)
}

export function isUnlocked(
  challengeId: string,
  allChallenges: string[],
  p: Progress,
  opts?: { topic?: string; isFirstInTopic?: boolean }
): boolean {
  const idx = allChallenges.indexOf(challengeId)
  if (idx === 0) return true

  // all challenges in a pre-unlocked topic are accessible
  if (opts?.topic && p.unlockedTopics.includes(opts.topic)) {
    return true
  }

  const prev = allChallenges[idx - 1]
  return prev !== undefined && p.completed[prev] !== undefined
}
