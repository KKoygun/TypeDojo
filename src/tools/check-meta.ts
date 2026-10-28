// Validates every challenges/typescript/*/meta.json against the Zod schema in src/schema.ts,
// plus the things a schema cannot see: folder name matches the topic id, file challenges have
// template.ts and tests.ts, and challenge ids are unique across the whole curriculum.
//   npm run check:meta
import * as fs from "fs"
import * as path from "path"
import { CHALLENGES_DIR } from "../curriculum"
import { topicSchema } from "../schema"

export function checkMeta(dir: string = CHALLENGES_DIR): string[] {
  const problems: string[] = []
  const ids = new Map<string, string>()

  for (const folder of fs.readdirSync(dir).sort()) {
    const topicDir = path.join(dir, folder)
    if (!fs.statSync(topicDir).isDirectory()) continue
    const metaPath = path.join(topicDir, "meta.json")
    if (!fs.existsSync(metaPath)) {
      problems.push(`${folder}: no meta.json`)
      continue
    }

    let raw: unknown
    try {
      raw = JSON.parse(fs.readFileSync(metaPath, "utf-8"))
    } catch (e: any) {
      problems.push(`${folder}/meta.json: invalid JSON (${e.message})`)
      continue
    }

    const parsed = topicSchema.safeParse(raw)
    if (!parsed.success) {
      for (const issue of parsed.error.issues) problems.push(`${folder}/meta.json ${issue.path.join(".")}: ${issue.message}`)
      continue
    }

    const topic = parsed.data
    if (topic.id !== folder) problems.push(`${folder}/meta.json: id "${topic.id}" does not match its folder`)
    for (const c of topic.challenges) {
      const other = ids.get(c.id)
      if (other) problems.push(`${folder}: ${c.id} is also used in ${other}`)
      ids.set(c.id, folder)
      if (c.type === "file") {
        for (const file of [c.templateFile, c.testFile]) {
          if (!fs.existsSync(path.join(topicDir, c.id, file))) problems.push(`${folder}/${c.id}: missing ${file}`)
        }
      }
    }
  }
  return problems
}

function main(): void {
  const problems = checkMeta()
  if (problems.length) {
    for (const p of problems) console.error(`  ${p}`)
    console.error(`\n${problems.length} problem(s) in meta.json files`)
    process.exit(1)
  }
  console.log("All meta.json files match the schema.")
}

if (require.main === module) main()
