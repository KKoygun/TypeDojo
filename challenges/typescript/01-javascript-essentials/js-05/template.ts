// Challenge: simple closures
// makeMultiplier(factor): returns a function that multiplies its argument by factor
//   const double = makeMultiplier(2); double(5) → 10; double(0) → 0
// makeToggle(initial): returns a function that flips between true and false each call
//   const t = makeToggle(false); t() → true; t() → false; t() → true

export function makeMultiplier(factor: number): (n: number) => number {
  // your implementation
}

export function makeToggle(initial: boolean): () => boolean {
  // your implementation
}
