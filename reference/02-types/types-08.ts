export function safeLength(value: unknown): number {
  if (typeof value === "string" || Array.isArray(value)) return value.length
  return 0
}
