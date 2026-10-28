async function processItem(n: number): Promise<number> {
  return n * 2
}

export async function processSequential(items: number[]): Promise<number[]> {
  const results: number[] = []
  for (const item of items) {
    results.push(await processItem(item))
  }
  return results
}

export async function processParallel(items: number[]): Promise<number[]> {
  return Promise.all(items.map((item) => processItem(item)))
}
