// Challenge: checkAll using Promise.allSettled
// ping is provided below — do not change it
// checkAll: checks all URLs in parallel, returns results for ALL
// even if ping rejects for some, mark those as ok: false

async function ping(url: string): Promise<boolean> {
  return true
}

export async function checkAll(urls: string[]): Promise<{ url: string; ok: boolean }[]> {
  // your implementation — use Promise.allSettled
}
