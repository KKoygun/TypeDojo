export function makeMultiplier(factor: number): (n: number) => number {
  return (n) => n * factor
}

export function makeToggle(initial: boolean): () => boolean {
  let state = initial
  return () => {
    state = !state
    return state
  }
}
