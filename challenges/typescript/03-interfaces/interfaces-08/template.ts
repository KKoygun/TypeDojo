// Challenge: Counter interface with method signatures + createCounter factory
// Counter: increment(): void, decrement(): void, value(): number, reset(): void
// createCounter(initial?: number): Counter — initial defaults to 0
//   const c = createCounter(5)
//   c.increment()  → count is now 6
//   c.value()      → 6
//   c.reset()      → count returns to 5 (the initial value, not 0)
//   c.decrement()  → count is now 4

export interface Counter {
  // your method signatures here
}

export function createCounter(initial?: number): Counter {
  // your implementation
}
