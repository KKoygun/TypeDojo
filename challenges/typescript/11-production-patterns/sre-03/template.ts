// Challenge: generic retry with exponential backoff

export interface RetryOptions {
  maxAttempts: number
  baseDelayMs: number
  multiplier: number
}

export function delay(ms: number): Promise<void> {
  // resolve after ms milliseconds
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  // attempt up to maxAttempts times with exponential backoff between retries
  // throw last error after all attempts exhausted
}
