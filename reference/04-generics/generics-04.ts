export function typeOf<T>(value: T): string {
  return typeof value
}

export function isString(value: unknown): value is string {
  return typeof value === "string"
}
