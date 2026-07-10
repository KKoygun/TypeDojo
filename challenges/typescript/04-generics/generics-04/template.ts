// Challenge: typeOf + isString type predicate
// typeOf: returns the typeof string for any value
// isString: type predicate — narrows value to string

export function typeOf<T>(value: T): string {
  // your implementation — use typeof
}

export function isString(value: unknown): value is string {
  // your implementation
}
