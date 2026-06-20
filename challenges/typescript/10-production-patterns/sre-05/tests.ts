import { createLogger, withFields } from "./solution"

let passed = 0; let failed = 0
function assert(cond: boolean, label: string) { cond ? passed++ : (console.error(`  FAIL: ${label}`), failed++) }

const lines: string[] = []
const origWrite = process.stdout.write.bind(process.stdout)
;(process.stdout as any).write = (chunk: string) => { lines.push(chunk); return true }

const logger = createLogger("test-service")
logger.info("hello world")
logger.warn("something off", { code: 42 })
logger.error("boom")
logger.debug("verbose", { trace: "abc" })

;(process.stdout as any).write = origWrite

assert(lines.length === 4, "4 log lines written")

const entry1 = JSON.parse(lines[0]!)
assert(entry1.level === "info", "level=info")
assert(entry1.message === "hello world", "message")
assert(entry1.service === "test-service", "service")
assert(typeof entry1.timestamp === "string", "timestamp is string")
assert(entry1.timestamp.includes("T"), "timestamp is ISO format")

const entry2 = JSON.parse(lines[1]!)
assert(entry2.fields?.code === 42, "fields passed through")

// withFields
const lines2: string[] = []
;(process.stdout as any).write = (chunk: string) => { lines2.push(chunk); return true }

const child = withFields(logger, { requestId: "req-123" })
child.info("request started")
child.info("request done", { latency: 50 })

;(process.stdout as any).write = origWrite

const e1 = JSON.parse(lines2[0]!)
assert(e1.fields?.requestId === "req-123", "withFields merges base fields")
const e2 = JSON.parse(lines2[1]!)
assert(e2.fields?.requestId === "req-123", "withFields merges on second call")
assert(e2.fields?.latency === 50, "withFields merges call-site fields")

if (failed > 0) { console.error(`\n  ${failed} test(s) failed`); process.exit(1) }
else console.log(`  ${passed} test(s) passed`)
