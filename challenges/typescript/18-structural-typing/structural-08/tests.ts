import { acceptsLogger, compose, results, basic, withOptional, withExtra } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

// acceptsLogger should work without throwing
try { acceptsLogger(basic); p++ } catch { console.error("  FAIL: acceptsLogger basic"); f++ }
try { acceptsLogger(withOptional); p++ } catch { console.error("  FAIL: acceptsLogger optional"); f++ }
try { acceptsLogger(withExtra); p++ } catch { console.error("  FAIL: acceptsLogger extra method"); f++ }

// compose
const double = (x: number) => x * 2
const toString = (x: number) => x.toString()
const doubleStr = compose(double, toString)
ok(doubleStr(5) === "10", "compose number → number → string")

const trim = (s: string) => s.trim()
const upper = (s: string) => s.toUpperCase()
const trimUpper = compose(trim, upper)
ok(trimUpper("  hello  ") === "HELLO", "compose string → string → string")

// results documentation
ok(results.basicAssignable === true, "basic is assignable")
ok(results.optionalParamAssignable === true, "optional param is assignable")
ok(results.requiredParamAssignable === false, "required extra param is NOT assignable")
ok(results.extraMethodAssignable === true, "extra method is assignable")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
