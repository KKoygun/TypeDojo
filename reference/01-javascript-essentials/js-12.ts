export function describeType(val: unknown): string {
  if (val === null) return "null"
  if (Array.isArray(val)) return "array"
  return typeof val
}

export function withFallback<T>(val: T | null | undefined, defaultVal: T): T {
  return val ?? defaultVal
}
