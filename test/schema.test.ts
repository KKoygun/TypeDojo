import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { checkMeta } from "../src/tools/check-meta"
import { scratchDir, removeDir, writeFiles } from "./helpers"

const terminal = (over: object = {}) => ({
  id: "types-01", title: "Q", topic: "02-types", level: 1, type: "terminal",
  description: "d", whyMatters: "w", hints: ["h"],
  choices: [{ label: "a", correct: true }, { label: "b", correct: false }],
  ...over,
})

const file = (over: object = {}) => ({
  id: "types-02", title: "F", topic: "02-types", level: 2, type: "file",
  description: "d", whyMatters: "w", hints: ["h"],
  solutionFile: "solution.ts", templateFile: "template.ts", testFile: "tests.ts",
  ...over,
})

const topic = (challenges: object[], over: object = {}) =>
  JSON.stringify({ id: "02-types", title: "T", description: "d", status: "validated", challenges, ...over })

function problemsFor(files: Record<string, string>): string[] {
  const dir = scratchDir("schema")
  try {
    writeFiles(dir, files)
    return checkMeta(dir)
  } finally {
    removeDir(dir)
  }
}

describe("meta.json check", () => {
  test("accepts a well-formed topic", () => {
    assert.deepEqual(
      problemsFor({
        "02-types/meta.json": topic([terminal(), file()]),
        "02-types/types-02/template.ts": "",
        "02-types/types-02/tests.ts": "",
      }),
      []
    )
  })

  test("rejects a question with two correct answers", () => {
    const choices = [{ label: "a", correct: true }, { label: "b", correct: true }]
    const problems = problemsFor({ "02-types/meta.json": topic([terminal({ choices })]) })
    assert.match(problems.join("\n"), /exactly one choice must be correct/)
  })

  test("rejects unknown keys, so typos do not pass silently", () => {
    const problems = problemsFor({ "02-types/meta.json": topic([terminal({ hint: ["typo"] })]) })
    assert.ok(problems.length > 0)
  })

  test("rejects an unknown status", () => {
    const problems = problemsFor({ "02-types/meta.json": topic([terminal()], { status: "done" }) })
    assert.match(problems.join("\n"), /status/)
  })

  test("flags a challenge whose topic field points elsewhere", () => {
    const problems = problemsFor({ "02-types/meta.json": topic([terminal({ topic: "03-interfaces" })]) })
    assert.match(problems.join("\n"), /should be "02-types"/)
  })

  test("flags a folder that does not match the topic id", () => {
    const problems = problemsFor({ "09-other/meta.json": topic([terminal()]) })
    assert.match(problems.join("\n"), /does not match its folder/)
  })

  test("flags a file challenge with no tests.ts", () => {
    const problems = problemsFor({
      "02-types/meta.json": topic([file()]),
      "02-types/types-02/template.ts": "",
    })
    assert.match(problems.join("\n"), /types-02: missing tests.ts/)
  })

  test("flags the same challenge id in two topics", () => {
    const problems = problemsFor({
      "02-types/meta.json": topic([terminal()]),
      "03-interfaces/meta.json": JSON.stringify({
        id: "03-interfaces", title: "I", description: "d", challenges: [terminal({ topic: "03-interfaces" })],
      }),
    })
    assert.match(problems.join("\n"), /types-01 is also used in 02-types/)
  })
})
