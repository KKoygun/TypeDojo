import * as fs from "fs"
import * as path from "path"

// Scratch space inside the repo (gitignored) so ts-node child processes still find
// tsconfig.json and node_modules the same way real challenges do
const SCRATCH_ROOT = path.join(__dirname, "../.test-tmp")

export function scratchDir(name: string): string {
  const dir = path.join(SCRATCH_ROOT, `${name}-${process.pid}-${Date.now()}`)
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

export function removeDir(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true })
}

export function writeFiles(dir: string, files: Record<string, string>): void {
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(dir, name)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }
}
