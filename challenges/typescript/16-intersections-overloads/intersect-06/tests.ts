import { format, lookup, coerce } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)
const throws = (fn: () => unknown, l: string) => {
  try { fn(); console.error(`  FAIL: ${l} (no throw)`); f++ } catch { p++ }
}

ok(format("hello").padEnd(10) === "hello     " || format("hello") === "hello     ", "format string pads to 10")
ok(format(3.14159) === "3.14", "format number 2dp")
ok(format(0) === "0.00", "format zero")
ok(format(true) === "yes", "format true")
ok(format(false) === "no", "format false")

const m = { host: "localhost", port: "8080" }
ok(lookup(m, "host") === "localhost", "lookup found")
ok(lookup(m, "port") === "8080", "lookup port")
throws(() => lookup(m, "missing"), "lookup throws without fallback")
ok(lookup(m, "missing", "default") === "default", "lookup fallback")

ok(coerce("42") === 42, "coerce string to number")
ok(coerce("3.14") === 3.14, "coerce float string")
ok(coerce(99) === "99", "coerce number to string")
ok(typeof coerce("1") === "number", "coerce returns number type")
ok(typeof coerce(1) === "string", "coerce returns string type")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
