// Challenge: typeof, null checks, and ??
// describeType(val): return a string describing the type — check in this order:
//   val === null → "null"   Array.isArray(val) → "array"   otherwise → typeof val
//   (typeof null is "object" — a known JS quirk, so check null first)
// withFallback(val, defaultVal): return val if not null/undefined, otherwise defaultVal
//   withFallback("hello", "default") → "hello"   withFallback(null, "default") → "default"
//   withFallback(0, 99) → 0   (0 is not null/undefined, so 0 is returned as-is)

export function describeType(val: unknown): string {
  // your implementation
}

export function withFallback<T>(val: T | null | undefined, defaultVal: T): T {
  // your implementation
}
