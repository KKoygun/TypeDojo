# Async & Promises

TypeScript types asynchronous code using Promises and async/await.

---

## Promise<T>

A Promise wraps a value that will be available in the future:

```
function fetchUser(): Promise<{ name: string }> {
  return fetch("/user").then(r => r.json())
}
```

---

## new Promise() — wrapping callbacks

Use the `new Promise()` constructor to convert a callback-based function into a Promise:

```
function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

await delay(1000)   // waits 1 second
```

The executor receives `resolve` and `reject`. Call `resolve(value)` when done, `reject(reason)` to signal failure.

---

## async functions

`async` makes a function return a Promise automatically:

```
async function getName(): Promise<string> {
  return "Alice"   // automatically wrapped in Promise<string>
}
```

The return type annotation `Promise<string>` is optional — TypeScript infers it.
But writing it explicitly documents the contract.

---

## await unwraps the Promise

Inside an async function, `await` strips the Promise wrapper:

```
async function main() {
  const name = await getName()   // type: string (not Promise<string>)
  console.log(name.toUpperCase())
}
```

---

## Typed error handling

In catch blocks, errors are typed as `unknown` — narrow before using:

```
try {
  await riskyOperation()
} catch (err) {
  if (err instanceof Error) {
    console.log(err.message)   // safe — TypeScript knows it's an Error
  }
}
```

---

## Promise.all — parallel execution

Starts all operations at the same time:

```
const [user, config] = await Promise.all([fetchUser(), fetchConfig()])
// Both start immediately. Total time = max(user, config) — not sum.
// If any one rejects, the whole Promise.all rejects.
```

---

## Promise.allSettled — tolerant parallel

Returns results for ALL, even if some fail:

```
const results = await Promise.allSettled([fetchA(), fetchB()])
for (const result of results) {
  if (result.status === "fulfilled") console.log(result.value)
  if (result.status === "rejected")  console.log(result.reason)
}
```

---

## AbortController — cancellable operations

```
const controller = new AbortController()
setTimeout(() => controller.abort(), 5000)   // cancel after 5s

const response = await fetch(url, { signal: controller.signal })
```

---

## Measuring elapsed time

`Date.now()` returns the current time in milliseconds. Subtract two values to measure how long an operation took:

```
const start = Date.now()
await someOperation()
const elapsed = Date.now() - start   // milliseconds elapsed
```

Capture `start` before the operation and compute `elapsed` after. Works inside `try/finally` to record timing even when the operation throws.

---

You can return to this screen any time from the challenge menu.
