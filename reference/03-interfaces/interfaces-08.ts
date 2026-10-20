export interface Counter {
  increment(): void
  decrement(): void
  value(): number
  reset(): void
}

export function createCounter(initial: number = 0): Counter {
  let count = initial
  return {
    increment() { count++ },
    decrement() { count-- },
    value() { return count },
    reset() { count = initial },
  }
}
