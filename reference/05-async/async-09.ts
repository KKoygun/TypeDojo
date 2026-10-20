export interface DataResult<T> {
  data: T | null
  error: string | null
  duration: number
}

export async function withTiming<T>(fn: () => Promise<T>): Promise<DataResult<T>> {
  const start = Date.now()
  try {
    const data = await fn()
    return { data, error: null, duration: Date.now() - start }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { data: null, error, duration: Date.now() - start }
  }
}

export async function runPipeline(items: number[]): Promise<DataResult<number[]>> {
  return withTiming(() => Promise.all(items.map(async (n) => n * 2)))
}
