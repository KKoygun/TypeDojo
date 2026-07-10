// Challenge: fetchWithTimeout using AbortController
// get(url, signal) is provided below — do not change it
// fetchWithTimeout: creates an AbortController, sets a timeout,
//   calls get() with the signal, clears timeout in finally

async function get(url: string, signal: AbortSignal): Promise<string> {
  return url
}

export async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  // 1. Create AbortController
  // 2. setTimeout to abort after timeoutMs
  // 3. try { await get(url, signal) } finally { clearTimeout }
}
