import { z } from "zod"

const base = {
  id: z.string().regex(/^[a-z]+-\d{2}$/, "id must look like types-04"),
  title: z.string().min(1),
  topic: z.string().min(1),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  description: z.string().min(1),
  whyMatters: z.string().min(1),
  hints: z.array(z.string().min(1)).min(1),
}

const terminalChallenge = z.strictObject({
  ...base,
  type: z.literal("terminal"),
  choices: z
    .array(z.strictObject({ label: z.string().min(1), correct: z.boolean() }))
    .min(2)
    .refine((choices) => choices.filter((c) => c.correct).length === 1, "exactly one choice must be correct"),
})

const fileChallenge = z.strictObject({
  ...base,
  type: z.literal("file"),
  solutionFile: z.literal("solution.ts"),
  templateFile: z.literal("template.ts"),
  testFile: z.literal("tests.ts"),
})

export const challengeSchema = z.discriminatedUnion("type", [terminalChallenge, fileChallenge])

export const topicSchema = z
  .strictObject({
    id: z.string().regex(/^\d{2}-[a-z-]+$/, "topic id must look like 02-types"),
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(["validated", "draft"]).optional(),
    challenges: z.array(challengeSchema).min(1),
  })
  .superRefine((topic, ctx) => {
    const seen = new Set<string>()
    topic.challenges.forEach((c, i) => {
      if (c.topic !== topic.id) {
        ctx.addIssue({ code: "custom", path: ["challenges", i, "topic"], message: `should be "${topic.id}"` })
      }
      if (seen.has(c.id)) ctx.addIssue({ code: "custom", path: ["challenges", i, "id"], message: `duplicate id ${c.id}` })
      seen.add(c.id)
    })
  })
