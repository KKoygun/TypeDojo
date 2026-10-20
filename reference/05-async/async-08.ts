async function get(url: string, signal: AbortSignal): Promise<string> {
  return url
}

export async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await get(url, controller.signal)
  } finally {
    clearTimeout(timer)
  }
}
