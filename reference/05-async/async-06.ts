async function ping(url: string): Promise<boolean> {
  return true
}

export async function checkAll(urls: string[]): Promise<{ url: string; ok: boolean }[]> {
  const settled = await Promise.allSettled(urls.map((url) => ping(url)))
  return settled.map((result, i) => ({
    url: urls[i]!,
    ok: result.status === "fulfilled" && result.value,
  }))
}
