export function getLength<T extends { length: number }>(value: T): number {
  return value.length
}

export function getLongest<T extends { length: number }>(a: T, b: T): T {
  return b.length > a.length ? b : a
}
