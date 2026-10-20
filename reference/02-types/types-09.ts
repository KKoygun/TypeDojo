export function describeValue(value: unknown): string {
  if (typeof value === "string") return `string of length ${value.length}`
  if (typeof value === "number") return `number: ${value}`
  if (typeof value === "boolean") return `boolean: ${value}`
  if (Array.isArray(value)) return `array of length ${value.length}`
  return "object"
}
