export async function fetchNumber(): Promise<number> {
  return 42
}

export async function doubleAsync(n: number): Promise<number> {
  return n * 2
}

export async function pipeline(): Promise<string> {
  const n = await fetchNumber()
  const doubled = await doubleAsync(n)
  return `Result: ${doubled}`
}
