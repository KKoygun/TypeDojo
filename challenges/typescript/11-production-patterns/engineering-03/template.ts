// Challenge: retry with exponential backoff

export interface RetryOptions {
  maxAttempts: number
  baseDelayMs: number
  multiplier: number
}

export function delay(ms: number): Promise<void> {
  // return a promise that resolves after ms milliseconds
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  // attempt fn() up to maxAttempts times
  // on failure wait baseDelayMs * multiplier^attempt ms before retrying
  // after maxAttempts total tries, throw the last error
}
