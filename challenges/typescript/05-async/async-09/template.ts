// Challenge: typed data pipeline with timing + error handling
// DataResult<T>: { data: T | null; error: string | null; duration: number }
// withTiming: runs fn, records how long it took, returns DataResult
// runPipeline: doubles all items in parallel wrapped in withTiming

export interface DataResult<T> {
  data: T | null
  error: string | null
  duration: number
}

export async function withTiming<T>(fn: () => Promise<T>): Promise<DataResult<T>> {
  // your implementation
}

export async function runPipeline(items: number[]): Promise<DataResult<number[]>> {
  // your implementation — double each item in parallel, wrap in withTiming
}
