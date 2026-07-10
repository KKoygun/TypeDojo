# Generics

Generics let you write functions and types that work across many types while preserving type information.

---

## The problem generics solve

Without generics, you lose type safety:

```
function identity(value: any): any {
  return value
}
const n = identity(42)   // type: any — TypeScript can't help downstream
```

With generics, the return type relates to the input:

```
function identity<T>(value: T): T {
  return value
}
const n = identity(42)   // type: number — TypeScript knows!
```

`T` is a type placeholder. You write it once, TypeScript fills it in at call time based on what you pass.
You can use any letter — `T` is convention, but `A`, `B`, `Item`, `Value` are all valid.

---

## Generic interfaces

Interfaces can be generic too — the type parameter goes after the interface name:

```
interface Box<T> {
  value: T
}

const box: Box<number> = { value: 42 }
const strBox: Box<string> = { value: "hello" }
```

The type inside the box changes, but the shape stays the same.

---

## Generic constraints

Use `extends` to require that T has certain properties:

```
function getLength<T extends { length: number }>(value: T): number {
  return value.length
}

getLength("hello")      // ✓ strings have length
getLength([1, 2, 3])    // ✓ arrays have length
getLength(42)           // ✗ error — numbers have no length
```

Without the constraint, TypeScript won't let you access `.length` on T — it doesn't know T has it.

---

## Tuples

A tuple is an array with a fixed number of elements where each position has a known type:

```
const pair: [string, number] = ["alice", 42]

pair[0]   // type: string
pair[1]   // type: number
```

Unlike a regular array, the types at each index are tracked separately.
Useful when you want to return two values of different types from a function.

---

## map and forEach with generics

When you call `map` on a typed array, TypeScript carries the element type through the callback automatically:

```
const wrapped: Array<Wrapper<number>> = [wrap(1), wrap(2), wrap(3)]
const values = wrapped.map(w => unwrap(w))   // type: number[]
```

The return type of `map` is always inferred from whatever the callback returns — no annotation needed. The same `map` that works on `Wrapper<number>` works on `Wrapper<string>` with no changes.

`forEach` works the same way but returns `void` — use it when you want to act on each element without collecting results:

```
wrapped.forEach(w => console.log(unwrap(w)))
```

---

## Functions as parameters

In TypeScript you can pass a function as an argument to another function.
The type of that function parameter uses an arrow syntax:

```
function apply(value: number, fn: (x: number) => string): string {
  return fn(value)
}

apply(42, (x) => x.toString())   // "42"
```

`fn: (x: number) => string` means "a function that takes a number and returns a string".
You call it inside the body just like any function: `fn(value)`.

With generics, the input and output types become type parameters:

```
function transform<A, B>(value: A, fn: (a: A) => B): B {
  return fn(value)
}
```

---

## Multiple type parameters

```
function swap<A, B>(pair: [A, B]): [B, A] {
  return [pair[1], pair[0]]
}

swap(["hello", 42])   // type: [number, string]
```

Each letter is a separate type placeholder. TypeScript tracks them independently through the function.

---

## Type predicates

A type predicate is a return type that tells TypeScript "if this returns true, narrow the type to X":

```
function isString<T>(value: T): value is string {
  return typeof value === "string"
}

const x: unknown = "hello"
if (isString(x)) {
  x.toUpperCase()   // ✓ TypeScript knows x is string inside this block
}
```

Without the `value is string` return type, TypeScript only sees `boolean` — it won't narrow.

---

## keyof and indexed access

`keyof T` gives you a type that represents all valid property names of T.
Think of it as "the set of keys this object is allowed to have":

```
interface User {
  id: string
  age: number
}

type UserKey = keyof User   // "id" | "age"
```

You can use `keyof T` as a constraint so a function only accepts valid key names:

```
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

const user = { id: "u1", age: 30 }
getProperty(user, "age")    // ✓ valid key
getProperty(user, "email")  // ✗ error — "email" is not a key of User
```

`T[K]` is the type of the value at that key — TypeScript works it out automatically.
So if `K` is `"age"`, then `T[K]` is `number`.

Once you have `getProperty` working, applying it to every item in an array is just `.map()`.

---

## Map

`Map<K, V>` is a key-value store built into JavaScript. Unlike a plain object, keys can be any type
and the API is explicit:

```
const store = new Map<string, number>()

store.set("a", 1)
store.get("a")        // 1 (or undefined if missing)
store.delete("a")     // true if it existed, false if not
store.values()        // iterable of all values
```

`Array.from(store.values())` converts the values into a plain array.

---

You can return to this screen any time from the challenge menu.
