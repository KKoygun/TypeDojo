import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { applyToReadme, renderTopics } from "../src/tools/readme"
import { TopicMeta } from "../src/types"

const topics: TopicMeta[] = [
  { id: "01-a", title: "A", description: "", status: "validated", challenges: [] },
  { id: "02-b", title: "B", description: "", challenges: [] },
]

describe("README generator", () => {
  test("marks topics without a status as preview", () => {
    const block = renderTopics(topics)
    assert.match(block, /\| 01 \| A \| 0 \| validated \|/)
    assert.match(block, /\| 02 \| B \| 0 \| preview \|/)
  })

  test("replaces only the text between the markers", () => {
    const readme = "intro\n<!-- generated:topics:start -->\nold\n<!-- generated:topics:end -->\noutro\n"
    assert.equal(
      applyToReadme(readme, "new"),
      "intro\n<!-- generated:topics:start -->\nnew\n<!-- generated:topics:end -->\noutro\n"
    )
  })

  test("refuses to run without markers", () => {
    assert.throws(() => applyToReadme("no markers", "x"), /markers/)
  })
})
