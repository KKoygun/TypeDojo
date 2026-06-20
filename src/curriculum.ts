import * as fs from "fs"
import * as path from "path"
import { TopicMeta } from "./types"

const CHALLENGES_DIR = path.join(__dirname, "../challenges/typescript")

export function loadCurriculum(): TopicMeta[] {
  const topics: TopicMeta[] = []
  if (!fs.existsSync(CHALLENGES_DIR)) return topics

  const topicDirs = fs.readdirSync(CHALLENGES_DIR).sort()
  for (const dir of topicDirs) {
    const metaPath = path.join(CHALLENGES_DIR, dir, "meta.json")
    if (fs.existsSync(metaPath)) {
      try {
        topics.push(JSON.parse(fs.readFileSync(metaPath, "utf-8")))
      } catch {
        // malformed meta, skip
      }
    }
  }
  return topics
}

export function allChallengeIds(curriculum: TopicMeta[]): string[] {
  return curriculum.flatMap((t) => t.challenges.map((c) => c.id))
}
