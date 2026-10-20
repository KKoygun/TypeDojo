import * as fs from "fs"
import * as path from "path"
import { TopicMeta, TopicStatus } from "./types"

export const CHALLENGES_DIR = path.join(__dirname, "../challenges/typescript")

export function loadCurriculum(dir: string = CHALLENGES_DIR): TopicMeta[] {
  const topics: TopicMeta[] = []
  if (!fs.existsSync(dir)) return topics

  const topicDirs = fs.readdirSync(dir).sort()
  for (const topicDir of topicDirs) {
    const metaPath = path.join(dir, topicDir, "meta.json")
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

// A topic without an explicit status is treated as draft
export function topicStatus(topic: TopicMeta): TopicStatus {
  return topic.status ?? "draft"
}

export function isPreview(topic: TopicMeta): boolean {
  return topicStatus(topic) === "draft"
}

export interface StatusCount {
  topics: number
  challenges: number
}

export function statusSummary(curriculum: TopicMeta[]): Record<TopicStatus, StatusCount> {
  const summary: Record<TopicStatus, StatusCount> = {
    validated: { topics: 0, challenges: 0 },
    draft: { topics: 0, challenges: 0 },
  }
  for (const topic of curriculum) {
    const s = summary[topicStatus(topic)]
    s.topics++
    s.challenges += topic.challenges.length
  }
  return summary
}
