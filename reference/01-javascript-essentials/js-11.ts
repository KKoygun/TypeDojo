export function classify(n: number): string {
  if (n > 0) return "positive"
  if (n < 0) return "negative"
  return "zero"
}

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min
  if (value > max) return max
  return value
}
