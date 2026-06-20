// Challenge: parallel health checker using Promise.allSettled
// ping is provided — do not implement it, just import and call it

import { ping } from "./ping"

export async function checkAll(urls: string[]): Promise<{ url: string; ok: boolean }[]> {
  // check all URLs in parallel
  // return results for ALL — even if some fail
}
