// Simulated ping — resolves true for reachable URLs, rejects for unreachable ones
export async function ping(url: string): Promise<boolean> {
  if (url.includes("down") || url.includes("fail")) {
    throw new Error(`Unreachable: ${url}`)
  }
  return true
}
