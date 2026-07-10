# Interfaces & Object Shapes

An interface names the shape of an object — what properties it has and what type each one is.

---

## Basic interface

```
interface User {
  id: string
  name: string
  age: number
}
```

Any object with those three properties (and those types) satisfies User.
TypeScript checks this at compile time, not at runtime.

---

## Optional properties

Add `?` to make a property optional:

```
interface Config {
  host: string
  port: number
  timeout?: number    // type is number | undefined
}
```

When a property or parameter is optional, TypeScript types it as `number | undefined` —
meaning it might not exist. If you try to use it directly in a calculation you will get an error.

The `??` operator (nullish coalescing) gives a fallback for exactly this case:

```
function connect(config: Config) {
  const timeout = config.timeout ?? 3000  // use 3000 if timeout is undefined
}
```

Read it as: "use the left side, unless it is null or undefined — then use the right side."

---

## Readonly properties

Add `readonly` to prevent mutation after creation:

```
interface Point {
  readonly x: number
  readonly y: number
}

const p: Point = { x: 0, y: 0 }
p.x = 1   // error: cannot assign to 'x' — it is read-only
```

---

## Extending interfaces

An interface can extend another, inheriting all its properties:

```
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

// Dog requires: name (from Animal) + breed
const dog: Dog = { name: "Rex", breed: "Labrador" }
```

---

## Nested interfaces

Interfaces can nest inside each other:

```
interface Address {
  street: string
  city: string
}

interface Person {
  name: string
  address: Address
}
```

---

## Index signatures

When keys are dynamic but values share a type:

```
interface Labels {
  [key: string]: string
}

const labels: Labels = { env: "prod", team: "platform" }
```

A convenient shorthand when all values share a type is the built-in `Record<K, V>`:

```
const scores: Record<string, number> = {}   // same as { [key: string]: number }
scores["alice"] = 95
scores["bob"]   = 87
```

`Record<string, string>` means every key and every value is a string — TypeScript infers this at the call site.

---

## Merging objects with spread

The spread operator `...` (three dots) means "expand everything inside this object here".
It lets you build a new object by combining properties from existing ones:

```
const a = { env: "dev", region: "us" }
const b = { env: "prod" }

const merged = { ...a, ...b }
// { env: "prod", region: "us" }
```

When the same key exists in both, whichever comes last wins.
The original objects are not modified — you always get a brand new object back.

---

## Method signatures

An interface can describe not just data fields, but also functions an object must have.
The interface says what the function looks like — parameters and return type — but not how it works.
The actual logic comes when you implement it:

```
interface Logger {
  log(message: string): void
  error(message: string, code?: number): void
}
```

If you are coming from Java or C#: this is similar to an interface with abstract methods.
The difference is there are no classes required — any object with matching functions satisfies it.

---

## Closures and interfaces

Interfaces describe what methods an object must have — not how they work internally. A closure lets you attach private state to those methods without using a class:

```
function makeCounter(): Counter {
  let count = 0   // private — callers cannot access this directly

  return {
    increment() { count++ },
    value()     { return count }
  }
}

const c = makeCounter()
c.increment()
c.increment()
c.value()   // 2
```

The returned object satisfies the `Counter` interface. `count` is captured by the methods but invisible to anything outside. This is the standard pattern for implementing stateful interfaces in TypeScript without classes.

---

You can return to this screen any time from the challenge menu.
