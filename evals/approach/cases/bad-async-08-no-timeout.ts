async function get(url: string, signal: AbortSignal): Promise<string> {
  return url
}

export async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  return get(url, new AbortController().signal)
}
