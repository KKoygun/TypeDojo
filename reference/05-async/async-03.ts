export async function safeDivide(a: number, b: number): Promise<number> {
  if (b === 0) throw new Error("Cannot divide by zero")
  return a / b
}

export async function trySafeDivide(a: number, b: number): Promise<string> {
  try {
    const result = await safeDivide(a, b)
    return `Result: ${result}`
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return `Error: ${message}`
  }
}
