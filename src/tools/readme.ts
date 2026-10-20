// Regenerates the topic table and status section in README.md from the meta.json files.
//   npm run readme           rewrite README.md
//   npm run readme -- --check  exit 1 if README.md is out of date (used in CI)
import * as fs from "fs"
import * as path from "path"
import { loadCurriculum, statusSummary, topicStatus } from "../curriculum"
import { TopicMeta } from "../types"
import { RUNTIME_UNTESTABLE } from "./validate"

const README = path.join(__dirname, "../../README.md")
const START = "<!-- generated:topics:start -->"
const END = "<!-- generated:topics:end -->"

function exceptionNote(): string {
  const ids = Object.keys(RUNTIME_UNTESTABLE)
  if (ids.length === 0) return ""
  const list = ids.map((id) => "`" + id + "`").join(", ")
  return `Exception: ${list} only asks for type annotations, which a runtime test cannot see, ` +
    "so the compile step and the AI review grade it instead. "
}

export function renderTopics(curriculum: TopicMeta[]): string {
  const { validated, draft } = statusSummary(curriculum)
  const total = validated.challenges + draft.challenges
  const lines = [
    `${total} challenges across ${curriculum.length} topics. ` +
      `${validated.challenges} challenges in ${validated.topics} topics are validated; ` +
      `the other ${draft.challenges} are drafts, shown as "preview" in the app.`,
    "",
    "## Status",
    "",
    "| Status | Topics | Challenges |",
    "|---|---|---|",
    `| Validated | ${validated.topics} | ${validated.challenges} |`,
    `| Draft (preview) | ${draft.topics} | ${draft.challenges} |`,
    "",
    "**Validated** means every coding challenge in the topic has a reference solution (in `reference/`) " +
      "that passes its tests, and the untouched template fails them. `npm run validate` checks this in CI. " +
      exceptionNote() +
      "**Draft** topics are playable but have not been through that check and may change.",
    "",
    "## Topics",
    "",
    "| # | Topic | Challenges | Status |",
    "|---|---|---|---|",
    ...curriculum.map((t) => {
      const num = t.id.split("-")[0]
      const status = topicStatus(t) === "validated" ? "validated" : "preview"
      return `| ${num} | ${t.title} | ${t.challenges.length} | ${status} |`
    }),
  ]
  return lines.join("\n")
}

export function applyToReadme(readme: string, block: string): string {
  const start = readme.indexOf(START)
  const end = readme.indexOf(END)
  if (start < 0 || end < start) throw new Error(`README.md is missing the ${START} / ${END} markers`)
  return readme.slice(0, start + START.length) + "\n" + block + "\n" + readme.slice(end)
}

function main(): void {
  const check = process.argv.includes("--check")
  // README is committed with LF or CRLF depending on checkout; compare normalised
  const current = fs.readFileSync(README, "utf-8").replace(/\r\n/g, "\n")
  const next = applyToReadme(current, renderTopics(loadCurriculum()))

  if (check) {
    if (next !== current) {
      console.error("README.md topic/status section is out of date. Run: npm run readme")
      process.exit(1)
    }
    console.log("README.md topic/status section is up to date.")
    return
  }
  fs.writeFileSync(README, next)
  console.log("README.md updated.")
}

if (require.main === module) main()
