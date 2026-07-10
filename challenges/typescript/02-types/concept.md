# The Type System

TypeScript adds a layer on top of JavaScript that lets you describe the shape of your data.
The compiler reads those descriptions and warns you before you run anything.

---

## Annotations

You annotate a value by writing `: type` after the name.

```
let name: string = "Alice"
let port: number = 8080
let active: boolean = true
```

TypeScript infers types when you assign a value directly — you don't always need to annotate:

```
const count = 42        // inferred as number
const label = "hello"   // inferred as string
```

Annotate when the type isn't obvious, or when you want to be explicit about a function's contract.

---

## Function annotations

Both parameters and return types can be annotated:

```
function greet(name: string): string {
  return "Hello, " + name
}
```

If a function returns nothing, the return type is `void`.

---

## Optional parameters

Add `?` after a parameter name to make it optional:

```
function greet(name: string, title?: string): string {
  return title ? `Hello, ${title} ${name}` : `Hello, ${name}`
}

greet("Alice")          // "Hello, Alice"
greet("Alice", "Dr.")   // "Hello, Dr. Alice"
```

An optional parameter's type is automatically `T | undefined` — TypeScript knows the value might not be there. Use a conditional or `??` to handle the absent case safely.

---

## Union types

A value that can be one of several types uses `|`:

```
let id: string | number = "abc-123"
id = 42   // also valid
```

---

## Narrowing

When you have a union, TypeScript doesn't know which branch you're on until you check:

```
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase()   // TypeScript knows: string
  }
  return value.toFixed(2)        // TypeScript knows: number
}
```

This is called narrowing — the type gets more specific inside each branch.

---

## Literal types

Instead of just `string`, you can narrow to exact values:

```
type Status = "success" | "error" | "pending"

function getStatus(): Status {
  return "success"   // only these three values are valid
}
```

---

## unknown vs any

`any` turns TypeScript off — you can do anything with it, no errors appear.
`unknown` is the safer alternative — you must check the type before using the value.

```
function process(input: unknown): string {
  if (typeof input === "string") return input.toUpperCase()
  return String(input)
}
```

Prefer `unknown` over `any` when you don't control what comes in.

---

You can return to this screen any time from the challenge menu.
