# JavaScript Essentials

TypeScript is built on top of JavaScript. Before types come into the picture, you need solid JavaScript foundations. Everything in this topic is pure JavaScript behaviour — TypeScript just adds labels on top of it.

Note: the code challenges in this topic have type annotations already written in the template. Your job is to write the JavaScript logic inside the function bodies. Topic 02 (The Type System) explains what those annotations mean.

---

## Variables

Two keywords for declaring variables: `const` and `let`.

`const` means you cannot reassign the variable after creation:

```
const name = "Alice"
name = "Bob"   // error — cannot reassign a const
```

`let` means you can reassign it later:

```
let count = 0
count = 1      // fine
count++        // also fine — shorthand for count = count + 1
```

**Rule of thumb:** always start with `const`. Switch to `let` only when you know you need to reassign.

Avoid `var` — it has quirky scoping behaviour that causes bugs. `const` and `let` replaced it.

**Arithmetic operators:** `+` `-` `*` `/` — and two less obvious ones:

`%` is the **remainder** operator — what is left over after dividing:

```
10 % 3   // 1 — 10 ÷ 3 = 3 remainder 1
8 % 2    // 0 — no remainder, so 8 is even
7 % 2    // 1 — remainder 1, so 7 is odd
```

`**` is the **power** operator — base raised to an exponent:

```
2 ** 3   // 8  — 2 to the power 3
3 ** 2   // 9  — 3 squared
```

---

## Primitive values

The six primitive value types in JavaScript:

```
"hello"       // string
42            // number
3.14          // also a number — no separate float type
true          // boolean
false         // boolean
null          // intentional absence of a value
undefined     // a variable that has no value assigned yet
```

Strings can use single quotes, double quotes, or backticks:

```
'hello'
"hello"
`hello`       // backtick strings have extra powers — see Template literals below
```

---

## Functions

Two ways to write a function. Classic declaration:

```
function add(a, b) {
  return a + b
}
```

Arrow function assigned to a variable:

```
const add = (a, b) => {
  return a + b
}
```

Both behave the same for most purposes. If the body is a single expression, the arrow version can skip the braces and `return`:

```
const add = (a, b) => a + b   // same result, shorter syntax
```

**Default parameters** — give a parameter a fallback value if it is not provided:

```
function greet(name, greeting = "Hello") {
  return greeting + ", " + name
}

greet("Alice")           // "Hello, Alice"
greet("Alice", "Hi")    // "Hi, Alice"
```

---

## Template literals

Backtick strings let you embed values directly inside the string using `${}`:

```
const name = "Alice"
const age = 30

const message = `Hello, ${name}! You are ${age} years old.`
// "Hello, Alice! You are 30 years old."
```

Any expression works inside `${}`:

```
const result = `${2 + 2} is four`      // "4 is four"
const upper  = `${name.toUpperCase()}` // "ALICE"
```

Template literals replace string concatenation with `+`. Prefer them for anything beyond a simple join.

---

## String methods

Strings have built-in methods for the most common transformations.

**Trimming and casing:**

```
"  hello  ".trim()         // "hello" — removes leading and trailing whitespace
"Hello".toLowerCase()      // "hello"
"Hello".toUpperCase()      // "HELLO"
```

**Searching:**

```
"hello world".includes("world")   // true
"hello world".includes("xyz")     // false
```

**Splitting and joining:**

`split` turns a string into an array. `join` turns an array back into a string:

```
"hello world".split(" ")          // ["hello", "world"]
["hello", "world"].join("-")      // "hello-world"
["a", "b", "c"].join("")          // "abc"
```

Chain them together:

```
"Hello World".toLowerCase().split(" ").join("-")   // "hello-world"
```

**Slicing:**

```
"hello".slice(0, 3)   // "hel" — from index 0 up to (not including) index 3
"hello".slice(2)      // "llo" — from index 2 to the end
```

**Getting a character — use `.charAt(0)` not `[0]`:**

```
"hello".charAt(0)   // "h"
"hello".charAt(4)   // "o"
```

In TypeScript's strict mode, `str[0]` is typed as `string | undefined` even though it always returns a character. `.charAt(0)` always returns a `string`.

---

## Arrays

An array is an ordered list of values:

```
const names = ["Alice", "Bob", "Carol"]
const nums  = [10, 20, 30]
const mixed = [1, "hello", true]   // valid, but uncommon
```

Access elements by index (starting from 0):

```
names[0]   // "Alice"
names[1]   // "Bob"
names[2]   // "Carol"
names[3]   // undefined — past the end
```

`length` gives the number of elements:

```
names.length   // 3
```

To add an element to the end, use `.push()`:

```
const items = ["a", "b"]
items.push("c")   // items is now ["a", "b", "c"]
```

Start with an empty array and build it up in a loop:

```
const result: number[] = []
result.push(1)
result.push(2)
// [1, 2]
```

---

## Loops

**for...of** — iterate over the values of an array without dealing with indexes:

```
const names = ["Alice", "Bob", "Carol"]

for (const name of names) {
  console.log(name)   // Alice, Bob, Carol
}
```

**Traditional for loop** — when you need a counter or a specific number of iterations:

```
for (let i = 0; i < 5; i++) {
  console.log(i)   // 0, 1, 2, 3, 4
}
```

Three parts: `let i = 0` sets the start, `i < 5` is checked before each step, `i++` advances the counter. You can count down too:

```
for (let i = 3; i >= 0; i--) {
  result.push(i)
}
// pushes 3, 2, 1, 0
```

---

## Array methods: map, filter, forEach

These are the three you will use most.

**forEach** — run a function on each element, return nothing:

```
const nums = [1, 2, 3]
nums.forEach(n => console.log(n))   // prints 1, 2, 3
```

**map** — transform each element, return a new array of the same length:

```
const nums    = [1, 2, 3]
const squared = nums.map(n => n ** 2)
// [1, 4, 9] — original unchanged
```

**filter** — keep only elements where the function returns true:

```
const nums = [1, 2, 3, 4, 5, 6]
const even = nums.filter(n => n % 2 === 0)
// [2, 4, 6]
```

You can chain them:

```
const result = [1, 2, 3, 4, 5, 6]
  .filter(n => n % 2 === 0)   // [2, 4, 6]
  .map(n => n ** 2)           // [4, 16, 36]
```

---

## Objects

An object groups related values under named keys:

```
const user = {
  id: "u1",
  name: "Alice",
  age: 30,
}

user.name    // "Alice" — dot notation
user["age"]  // 30 — bracket notation (same result)
```

**Property shorthand** — when a variable and the key share the same name:

```
const host = "localhost"
const port = 8080

const config = { host, port }
// same as: { host: "localhost", port: 8080 }
```

---

## Record types

`Record<K, V>` is a TypeScript utility type for objects where every key is type `K` and every value is type `V`:

```
const scores: Record<string, number> = {}
scores["alice"] = 95
scores["bob"]   = 87
```

Values can also be arrays:

```
const groups: Record<string, string[]> = {}
groups["admin"] = ["alice", "bob"]
groups["guest"] = ["carol"]
```

`Record<string, string[]>` means: keys are strings, values are string arrays. You will see this as a return type on grouping functions.

---

## Spread operator

`...` copies all properties from one object into another:

```
const defaults = { timeout: 3000, retries: 3 }
const overrides = { timeout: 5000 }

const config = { ...defaults, ...overrides }
// { timeout: 5000, retries: 3 } — overrides wins on conflict
```

Also works on arrays:

```
const a = [1, 2]
const b = [3, 4]
const combined = [...a, ...b]   // [1, 2, 3, 4]
```

Spread always produces a new object or array — the originals are not modified.

---

## Destructuring

Pull values out of an object or array into named variables:

**Object destructuring:**

```
const user = { id: "u1", name: "Alice", age: 30 }

const { name, age } = user
// name = "Alice", age = 30
```

**Array destructuring:**

```
const nums = [10, 20, 30]

const [first, second] = nums
// first = 10, second = 20

const [head, ...tail] = nums
// head = 10, tail = [20, 30]
```

`...rest` in array destructuring captures everything after the first elements into a new array.

---

## Conditionals

**Boolean operators** connect conditions:

`&&` — both must be true:

```
age >= 18 && hasTicket   // true only if both pass
```

`||` — at least one must be true:

```
isAdmin || isOwner   // true if either passes
```

`!` — flips a boolean:

```
!true    // false
!false   // true
```

Short-circuit: `&&` stops at the first false. `||` stops at the first true — the rest never runs.

Classic if/else:

```
function classify(n) {
  if (n > 0) {
    return "positive"
  } else if (n < 0) {
    return "negative"
  } else {
    return "zero"
  }
}
```

**Ternary** — a compact one-line if/else that produces a value:

```
const label = n > 0 ? "positive" : "non-positive"
```

Read it as: "if condition, use left side, otherwise use right side."

---

## typeof, null/undefined, and ??

`typeof` returns a string describing the type of a value:

```
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"  ← historical JavaScript quirk — null is NOT an object
typeof []          // "object"  ← arrays are also objects
typeof {}          // "object"
```

Because both `null` and arrays report `"object"`, you need specific checks for them:

```
val === null          // the only reliable null check
Array.isArray(val)    // the only reliable array check
```

**The ?? operator** provides a fallback when a value is `null` or `undefined`:

```
const timeout = userSetting ?? 3000
// use userSetting if it exists, otherwise use 3000
```

`??` only triggers on `null` and `undefined` — not on `0`, `false`, or `""`.

**instanceof** checks if a value was created from a specific constructor:

```
const err = new Error("oops")
err instanceof Error   // true

const d = new Date()
d instanceof Date      // true
```

---

## Error handling

Throw an error to signal that something went wrong:

```
function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero")
  return a / b
}
```

Catch it with try/catch:

```
try {
  const result = divide(10, 0)
} catch (err) {
  console.log(err.message)   // "Cannot divide by zero"
}
```

`finally` runs whether or not an error occurred — use it for cleanup:

```
try {
  const data = fetchData()
} catch (err) {
  console.log("Failed:", err.message)
} finally {
  cleanup()   // always runs
}
```

---

## Closures

A closure is a function that remembers variables from the scope where it was created, even after that scope has finished:

```
function makeAccumulator() {
  let total = 0        // this variable is "captured" by the inner functions

  return {
    add(n)    { total += n },
    subtract(n) { total -= n },
    value()   { return total },
    reset()   { total = 0 },
  }
}

const acc = makeAccumulator()
acc.add(10)
acc.add(5)
acc.value()    // 15
```

`total` is private — nothing outside `makeAccumulator` can touch it directly.
Only the returned functions can read or change it. This is how JavaScript achieves encapsulation without classes.

Another common closure: a function factory:

```
function makeAdder(amount) {
  return (n) => n + amount   // amount is captured from the outer scope
}

const addFive = makeAdder(5)
const addTen  = makeAdder(10)

addFive(3)   // 8
addTen(3)    // 13
```

A third pattern is the **call-once guard** — run a function exactly once and cache the result:

```
function makeOnce(fn) {
  let hasRun = false
  let result

  return () => {
    if (!hasRun) {
      hasRun = true
      result = fn()
    }
    return result
  }
}

const init = makeOnce(() => 'connected')
init()   // 'connected' — fn called
init()   // 'connected' — fn not called again, cached result returned
```

`hasRun` and `result` are private. Once the flag is set, every subsequent call skips the function and returns the stored value.

---

## Map

`Map` is a key-value store built into JavaScript. Unlike plain objects, keys can be any type and the Map API is explicit about what you're doing:

```
const store = new Map()

store.set("alice", 42)
store.get("alice")        // 42
store.get("bob")          // undefined — not found
store.has("alice")        // true
store.delete("alice")     // true — removed

store.set("bob", 10)
store.set("carol", 30)
store.size                // 2
```

To convert a Map's values into an array:

```
Array.from(store.values())   // [10, 30]
Array.from(store.keys())     // ["bob", "carol"]
Array.from(store.entries())  // [["bob", 10], ["carol", 30]]
```

---

## A few built-ins worth knowing

**JSON.stringify** — convert a JavaScript value to a JSON string:

```
JSON.stringify({ name: "Alice", age: 30 })
// '{"name":"Alice","age":30}'
```

**Object.fromEntries** — build an object from an array of `[key, value]` pairs:

```
const pairs = [["host", "localhost"], ["port", "8080"]]
Object.fromEntries(pairs)
// { host: "localhost", port: "8080" }
```

**setTimeout / clearTimeout** — schedule something to run after a delay:

```
const timer = setTimeout(() => {
  console.log("ran after 1 second")
}, 1000)

clearTimeout(timer)   // cancel before it fires
```

---

You can return to this screen any time from the challenge menu.
