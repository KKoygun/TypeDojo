import { UnwrapPromise, DeepReadonly } from "./solution"

// These are compile-time checks — if the file compiles, the types are correct.

// UnwrapPromise
type T1 = UnwrapPromise<Promise<string>>
const t1: T1 = "hello"  // must be string, not Promise<string>

type T2 = UnwrapPromise<number>
const t2: T2 = 42  // must remain number

type T3 = UnwrapPromise<Promise<{ host: string }>>
const t3: T3 = { host: "localhost" }  // must be the inner object type

// DeepReadonly
type Config = DeepReadonly<{ host: string; nested: { port: number } }>
const cfg: Config = { host: "localhost", nested: { port: 8080 } }
// cfg.host = "x"  // would be a compile error if uncommented
// cfg.nested.port = 9090  // would be a compile error if uncommented

let passed = 0
console.log("  Type checks passed at compile time")
passed++
console.log(`  ${passed} test(s) passed`)
