import { loadDeployments, validateAndSummarize } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }
function assertThrows(fn: () => unknown, label: string) {
  try { fn(); console.error(`  FAIL: ${label} (no throw)`); failed++ } catch { passed++ }
}

const valid = [
  { name: "api", image: "nginx:latest", replicas: 3 },
  { name: "worker", image: "worker:v2", replicas: 1, env: { LOG_LEVEL: "info" } },
]

const deployments = loadDeployments(valid)
assert(deployments.length === 2, "loads 2 deployments")
assert(deployments[0]?.name === "api", "first deployment name")
assert(deployments[1]?.env?.LOG_LEVEL === "info", "second deployment env")

assertThrows(() => loadDeployments([{ name: "", image: "nginx:latest", replicas: 1 }]), "throws on empty name")
assertThrows(() => loadDeployments([{ name: "api", image: "no-tag", replicas: 1 }]), "throws on invalid image format")
assertThrows(() => loadDeployments([{ name: "api", image: "nginx:latest", replicas: 25 }]), "throws on replicas > 20")
assertThrows(() => loadDeployments("not an array"), "throws on non-array")

const summary = validateAndSummarize(valid)
assert(summary.startsWith("2 valid deployments:"), "summary starts correctly")
assert(summary.includes("api"), "summary includes api")
assert(summary.includes("worker"), "summary includes worker")

assertThrows(() => validateAndSummarize([{ name: "bad", image: "notag", replicas: 1 }]), "validateAndSummarize throws on invalid")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
