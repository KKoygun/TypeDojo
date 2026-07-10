// Challenge: closures in practice
// makeCounter(initial): returns an object where all four methods share a private count variable
//   increment() — adds 1 to count
//   decrement() — subtracts 1 from count
//   value() — returns the current count
//   reset() — resets count back to initial
// makeOnce(fn): returns a wrapper — first call invokes fn and caches the result
//   every subsequent call returns the cached value without calling fn again
//   let calls = 0; const init = makeOnce(() => { calls++; return 'ready' })
//   init() → 'ready' (fn called, calls === 1)
//   init() → 'ready' (fn not called, calls still 1)

export function makeCounter(initial: number): {
  increment(): void
  decrement(): void
  value(): number
  reset(): void
} {
  // your implementation
}

export function makeOnce<T>(fn: () => T): () => T {
  // your implementation
}
