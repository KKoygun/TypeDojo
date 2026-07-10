// Challenge: sequential vs parallel processing
// processItem: doubles a number asynchronously
// processSequential: processes items one by one (for...of with await)
// processParallel: processes all at once (Promise.all)

async function processItem(n: number): Promise<number> {
  return n * 2
}

export async function processSequential(items: number[]): Promise<number[]> {
  // your implementation — use for...of with await
}

export async function processParallel(items: number[]): Promise<number[]> {
  // your implementation — use Promise.all
}
