import * as fs from "fs"
import * as path from "path"
import { Progress } from "./types"

const PROGRESS_FILE = path.join(__dirname, "../.progress.json")

const defaultProgress = (): Progress => ({
  completed: {},
  insightsUsed: 0,
  lastSeen: "",
  unlockedTopics: [],
})

export function loadProgress(): Progress {
  if (!fs.existsSync(PROGRESS_FILE)) return defaultProgress()
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"))
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(p: Progress): void {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2))
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
