async function ping(url: string): Promise<boolean> {
  return true
}

export async function checkAll(urls: string[]): Promise<{ url: string; ok: boolean }[]> {
  return Promise.all(urls.map(async (url) => ({ url, ok: await ping(url) })))
}
