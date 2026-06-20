// Challenge: pluck — extract a field from an array of objects
// K must be constrained to keys that actually exist on T

export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  // your implementation
}
