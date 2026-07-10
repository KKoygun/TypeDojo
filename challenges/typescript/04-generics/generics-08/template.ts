// Challenge: keyof + indexed access types
// getProperty: safely reads any property of an object by key
// pluck: extracts a named field from every object in an array

export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  // your implementation
}

export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  // your implementation
}
