export function divide(a: number, b: number): number {
  if (b === 0) throw new Error("Division by zero")
  return a / b
}

export function safeDivide(a: number, b: number): number {
  try {
    return divide(a, b)
  } catch {
    return 0
  }
}
