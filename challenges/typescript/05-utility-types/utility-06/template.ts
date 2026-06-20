// Challenge: loadEnv + buildServiceUrls

export function loadEnv(keys: string[]): Record<string, string> {
  // read each key from process.env, throw if missing
}

export function buildServiceUrls(
  envs: Record<'API_HOST' | 'DB_HOST' | 'CACHE_HOST', string>
): Record<string, string> {
  // return { api, db, cache } with protocol prefixes
}
