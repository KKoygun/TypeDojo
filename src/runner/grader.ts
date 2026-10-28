import { execSync } from "child_process"

// Run ts-node through the current node binary instead of npx: same result, no npx startup cost
const TS_NODE = `"${process.execPath}" "${require.resolve("ts-node/dist/bin.js")}"`

export interface GradeResult {
  ok: boolean
  output: string
}

export interface GradeOptions {
  // Skip type checking and only run the code. Used by `npm run validate` to prove that
  // the tests fail on an unimplemented template for runtime reasons, not just type errors.
  transpileOnly?: boolean
}

export function cleanError(raw: string): string {
  return raw
    .split("\n")
    .filter(l => /error TS\d+/.test(l) || (l.trim().startsWith("error") && !l.includes("node_modules")))
    .map(l => "  " + l.trim())
    .join("\n")
}

function formatTestOutput(raw: string): string {
  return raw
    .split("\n")
    .map(line => {
      const m = line.match(/^(\s*FAIL:[^→]+)→\s*(".*?")\s*\(expected\s*(".*?")\)/)
      if (m) {
        const pad = " ".repeat(m[1]!.replace(/\S.*/, "").length + 6)
        return `${m[1]!.trimEnd()}\n${pad}got:      ${m[2]}\n${pad}expected: ${m[3]}`
      }
      return line
    })
    .join("\n")
}

function env(opts: GradeOptions, extra: Record<string, string> = {}): NodeJS.ProcessEnv {
  const vars: NodeJS.ProcessEnv = { ...process.env, ...extra }
  // Never inherit transpile-only from the parent: a type check must really type-check
  if (opts.transpileOnly) vars.TS_NODE_TRANSPILE_ONLY = "true"
  else delete vars.TS_NODE_TRANSPILE_ONLY
  return vars
}

export function compileCheck(solutionPath: string, opts: GradeOptions = {}): GradeResult {
  try {
    execSync(`${TS_NODE} "${solutionPath}"`, { encoding: "utf-8", stdio: "pipe", env: env(opts) })
    return { ok: true, output: "" }
  } catch (e: any) {
    const raw = ((e.stdout ?? "") + (e.stderr ?? "")) || (e.message ?? "")
    return { ok: false, output: cleanError(raw) || raw.split("\n").filter((l: string) => l.trim() && !l.includes("node_modules")).slice(0, 3).join("\n") }
  }
}

// tests.ts imports from "./solution", so this always grades the solution.ts that sits
// next to testFile. To grade other code, put it in a solution.ts beside a copy of tests.ts.
export function runTests(testFile: string, solutionPath: string, opts: GradeOptions = {}): GradeResult {
  try {
    const output = execSync(`${TS_NODE} "${testFile}"`, {
      encoding: "utf-8",
      stdio: "pipe",
      env: env(opts, { SOLUTION_PATH: solutionPath }),
    })
    return { ok: true, output }
  } catch (e: any) {
    const raw = ((e.stdout ?? "") + (e.stderr ?? "")) || (e.message ?? "")
    const cleaned = cleanError(raw)
    const testOut = formatTestOutput(raw.split("\n").filter((l: string) => !l.includes("node_modules") && l.trim()).join("\n"))
    return { ok: false, output: cleaned || testOut }
  }
}

// Every tests.ts ends with "N test(s) passed" on success
export function passedCount(output: string): number {
  const m = output.match(/(\d+) test\(s\) passed/)
  return m ? Number(m[1]) : 0
}
