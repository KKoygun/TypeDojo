import { createLogger, withFields } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

const lines: string[] = []
const origWrite = process.stdout.write.bind(process.stdout)
process.stdout.write = (chunk: any) => { lines.push(chunk.toString()); return true }

const logger = createLogger("test-service")
logger.info("hello")
logger.warn("something", { key: "val" })
logger.error("boom")
logger.debug("trace")

process.stdout.write = origWrite

ok(lines.length === 4, "4 log lines written")

const entry0 = JSON.parse(lines[0])
ok(entry0.level === "info", "level is info")
ok(entry0.message === "hello", "message is hello")
ok(entry0.service === "test-service", "service field set")
ok(typeof entry0.timestamp === "string", "timestamp is string")

const entry1 = JSON.parse(lines[1])
ok(entry1.level === "warn", "warn level")
ok(entry1.fields?.key === "val", "fields passed through")

// withFields
const lines2: string[] = []
process.stdout.write = (chunk: any) => { lines2.push(chunk.toString()); return true }
const child = withFields(logger, { requestId: "abc123" })
child.info("request received")
process.stdout.write = origWrite

const entry2 = JSON.parse(lines2[0])
ok(entry2.fields?.requestId === "abc123", "withFields merges fields")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
