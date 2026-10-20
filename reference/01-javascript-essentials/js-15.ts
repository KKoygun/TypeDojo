export function makeCounter(initial: number): {
  increment(): void
  decrement(): void
  value(): number
  reset(): void
} {
  let count = initial
  return {
    increment() { count++ },
    decrement() { count-- },
    value() { return count },
    reset() { count = initial },
  }
}

export function makeOnce<T>(fn: () => T): () => T {
  let hasRun = false
  let result: T
  return () => {
    if (!hasRun) {
      hasRun = true
      result = fn()
    }
    return result
  }
}
