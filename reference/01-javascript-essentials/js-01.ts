export function repeat(str: string, n: number): string {
  let result = ""
  for (let i = 0; i < n; i++) {
    result += str
  }
  return result
}

export function countdown(from: number): number[] {
  const result: number[] = []
  for (let i = from; i >= 0; i--) {
    result.push(i)
  }
  return result
}
