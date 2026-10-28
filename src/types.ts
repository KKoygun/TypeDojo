export type ChallengeType = "terminal" | "file"

export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6

export interface Choice {
  label: string
  correct: boolean
}

export interface Challenge {
  id: string
  title: string
  topic: string
  level: Difficulty
  type: ChallengeType
  description: string
  whyMatters: string
  hints: string[]
  // terminal challenges
  choices?: Choice[]
  // file challenges
  solutionFile?: string
  templateFile?: string
  testFile?: string
}

// validated: every file challenge has a reference solution that passes `npm run validate`
// draft: content exists but has not been through that check yet (shown as "preview")
export type TopicStatus = "validated" | "draft"

export interface TopicMeta {
  id: string
  title: string
  description: string
  status?: TopicStatus
  challenges: Challenge[]
}

export type StartingLevel = "new" | "basics" | "comfortable" | "advanced"

export interface Progress {
  completed: Record<string, "pass" | "skip">
  insightsUsed: number
  lastSeen: string
  startingLevel?: StartingLevel
  unlockedTopics: string[]
  seenAutoSaveTip?: boolean
}
