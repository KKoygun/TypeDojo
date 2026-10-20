import { test, describe, beforeEach, after } from "node:test"
import assert from "node:assert/strict"
import * as fs from "fs"
import * as path from "path"
import { loadProgress, saveProgress, markComplete, isUnlocked } from "../src/progress"
import { Progress } from "../src/types"
import { scratchDir, removeDir } from "./helpers"

const dir = scratchDir("progress")
const file = path.join(dir, "progress.json")
process.env.TYPEDOJO_PROGRESS_FILE = file

after(() => {
  delete process.env.TYPEDOJO_PROGRESS_FILE
  removeDir(dir)
})

describe("progress store", () => {
  beforeEach(() => fs.rmSync(file, { force: true }))

  test("returns defaults when no file exists", () => {
    assert.deepEqual(loadProgress(), { completed: {}, insightsUsed: 0, lastSeen: "", unlockedTopics: [] })
  })

  test("returns defaults when the file is not valid JSON", () => {
    fs.writeFileSync(file, "{ broken")
    assert.equal(loadProgress().insightsUsed, 0)
  })

  test("saveProgress round-trips through loadProgress", () => {
    const p: Progress = {
      completed: { "js-01": "pass" }, insightsUsed: 2, lastSeen: "js-01",
      unlockedTopics: ["02-types"], startingLevel: "basics",
    }
    saveProgress(p)
    assert.deepEqual(loadProgress(), p)
  })

  test("markComplete records the result and lastSeen", () => {
    markComplete("js-01", "pass")
    markComplete("js-02", "skip")
    const p = loadProgress()
    assert.deepEqual(p.completed, { "js-01": "pass", "js-02": "skip" })
    assert.equal(p.lastSeen, "js-02")
  })

  test("writes to the override path, not the repo's .progress.json", () => {
    markComplete("js-01", "pass")
    assert.ok(fs.existsSync(file))
  })
})

describe("isUnlocked", () => {
  const ids = ["a-1", "a-2", "a-3", "b-1"]
  const base: Progress = { completed: {}, insightsUsed: 0, lastSeen: "", unlockedTopics: [] }

  test("the very first challenge is always unlocked", () => {
    assert.equal(isUnlocked("a-1", ids, base), true)
  })

  test("a challenge unlocks once the previous one is passed or skipped", () => {
    assert.equal(isUnlocked("a-2", ids, base), false)
    assert.equal(isUnlocked("a-2", ids, { ...base, completed: { "a-1": "pass" } }), true)
    assert.equal(isUnlocked("a-2", ids, { ...base, completed: { "a-1": "skip" } }), true)
  })

  test("a pre-unlocked topic opens all its challenges", () => {
    const p = { ...base, unlockedTopics: ["b"] }
    assert.equal(isUnlocked("b-1", ids, p, { topic: "b" }), true)
    assert.equal(isUnlocked("a-3", ids, p, { topic: "a" }), false)
  })

  test("an unknown id is locked", () => {
    assert.equal(isUnlocked("nope", ids, base), false)
  })
})
