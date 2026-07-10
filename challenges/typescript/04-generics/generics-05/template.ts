// Challenge: generic constraints
// getLength: accepts anything with a .length property, returns the length
// getLongest: returns whichever of a or b is longer (return a if equal)

export function getLength<T extends { length: number }>(value: T): number {
  // your implementation
}

export function getLongest<T extends { length: number }>(a: T, b: T): T {
  // your implementation
}
