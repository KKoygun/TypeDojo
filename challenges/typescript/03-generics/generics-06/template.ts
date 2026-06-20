// Challenge: Result<T> type + succeed / fail / unwrap

export type Result<T> = // your union type here

export function succeed<T>(value: T): Result<T> {
  // your implementation
}

export function fail<T>(error: string): Result<T> {
  // your implementation
}

export function unwrap<T>(result: Result<T>): T {
  // return value or throw error string
}
