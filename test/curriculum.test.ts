import { test, describe, after } from "node:test"
import assert from "node:assert/strict"
import { loadCurriculum, allChallengeIds, topicStatus, isPreview, statusSummary } from "../src/curriculum"
import { TopicMeta } from "../src/types"
import { scratchDir, removeDir, writeFiles } from "./helpers"

function topic(id: string, challengeIds: string[], status?: "validated" | "draft"): TopicMeta {
  return {
    id,
    title: id,
    description: "",
    ...(status ? { status } : {}),
    challenges: challengeIds.map((cid) => ({
      id: cid, title: cid, topic: id, level: 1, type: "terminal", description: "", whyMatters: "", hints: [],
    })),
  }
}

describe("loadCurriculum", () => {
  const dir = scratchDir("curriculum")
  after(() => removeDir(dir))

  writeFiles(dir, {
    "02-second/meta.json": JSON.stringify(topic("02-second", ["b-1"])),
    "01-first/meta.json": JSON.stringify(topic("01-first", ["a-1", "a-2"], "validated")),
    "03-broken/meta.json": "{ not json",
    "04-no-meta/notes.txt": "no meta.json here",
  })

  test("loads topics in folder order and skips malformed or missing meta", () => {
    const curriculum = loadCurriculum(dir)
    assert.deepEqual(curriculum.map((t) => t.id), ["01-first", "02-second"])
  })

  test("allChallengeIds flattens ids in curriculum order", () => {
    assert.deepEqual(allChallengeIds(loadCurriculum(dir)), ["a-1", "a-2", "b-1"])
  })

  test("returns an empty list when the folder does not exist", () => {
    assert.deepEqual(loadCurriculum(dir + "-missing"), [])
  })
})

describe("topic status", () => {
  test("missing status means draft", () => {
    assert.equal(topicStatus(topic("x", [])), "draft")
    assert.equal(isPreview(topic("x", [])), true)
    assert.equal(isPreview(topic("x", [], "validated")), false)
  })

  test("statusSummary counts topics and challenges per status", () => {
    const summary = statusSummary([
      topic("a", ["1", "2"], "validated"),
      topic("b", ["3"]),
      topic("c", ["4", "5", "6"], "draft"),
    ])
    assert.deepEqual(summary, {
      validated: { topics: 1, challenges: 2 },
      draft: { topics: 2, challenges: 4 },
    })
  })
})

describe("real curriculum", () => {
  const curriculum = loadCurriculum()

  test("challenge ids are unique", () => {
    const ids = allChallengeIds(curriculum)
    assert.equal(new Set(ids).size, ids.length)
  })

  test("every challenge's topic field matches the folder it lives in", () => {
    for (const t of curriculum) {
      for (const c of t.challenges) assert.equal(c.topic, t.id, c.id)
    }
  })

  test("only topics 01-05 are marked validated", () => {
    const validated = curriculum.filter((t) => topicStatus(t) === "validated").map((t) => t.id.slice(0, 2))
    assert.deepEqual(validated, ["01", "02", "03", "04", "05"])
  })
})
