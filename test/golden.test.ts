import { test, describe } from "node:test"
import assert from "node:assert/strict"
import * as fs from "fs"
import { caseFile, loadGoldenSet, score } from "../src/tools/ai-eval"
import { loadCurriculum, topicStatus } from "../src/curriculum"

describe("golden set", () => {
  const cases = loadGoldenSet()
  const validatedIds = new Set(
    loadCurriculum().filter((t) => topicStatus(t) === "validated").flatMap((t) => t.challenges.map((c) => c.id))
  )

  test("has 10 to 15 cases with both verdicts represented", () => {
    assert.ok(cases.length >= 10 && cases.length <= 15, `${cases.length} cases`)
    assert.ok(cases.some((c) => c.expected === "PASS"))
    assert.ok(cases.some((c) => c.expected === "FAIL"))
  })

  test("every case has a solution file, a known challenge and a reason", () => {
    for (const c of cases) {
      assert.ok(fs.existsSync(caseFile(c)), `${c.name}: missing ${caseFile(c)}`)
      assert.ok(validatedIds.has(c.challenge), `${c.name}: ${c.challenge} is not in a validated topic`)
      assert.ok(["PASS", "FAIL"].includes(c.expected), c.name)
      assert.ok(c.reason.trim().length > 0, `${c.name}: no reason`)
    }
  })

  test("case names are unique and say whether they are good or bad", () => {
    assert.equal(new Set(cases.map((c) => c.name)).size, cases.length)
    for (const c of cases) assert.equal(c.name.startsWith("good-"), c.expected === "PASS", c.name)
  })
})

describe("score", () => {
  test("counts agreement and both kinds of mistakes, ignoring missing recordings", () => {
    assert.deepEqual(
      score([
        { name: "a", expected: "PASS", got: "PASS" },
        { name: "b", expected: "FAIL", got: "PASS" },
        { name: "c", expected: "PASS", got: "FAIL" },
        { name: "d", expected: "FAIL", got: "FAIL" },
        { name: "e", expected: "FAIL", got: "missing" },
      ]),
      { scored: 4, agree: 2, falsePass: 1, falseFail: 1, missing: 1 }
    )
  })
})
