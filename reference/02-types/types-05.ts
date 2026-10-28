export function stringify(value: string | number | boolean): string {
  if (typeof value === "string") return value
  if (typeof value === "number") return value.toFixed(2)
  return value ? "yes" : "no"
}
