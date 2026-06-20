// Challenge: fetchWithTimeout
// fetch is available as a global (mocked in tests)

export async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  // 1. Create AbortController
  // 2. Set timeout that aborts after timeoutMs
  // 3. Fetch with the signal
  // 4. Return response body as text
  // 5. On abort: throw Error("Request timed out: {url}")
  // 6. Clear the timeout on success (in finally)
}
