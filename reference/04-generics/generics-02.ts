export function identity<T>(value: T): T {
  return value
}

export function firstItem<T>(arr: T[]): T | undefined {
  return arr[0]
}
