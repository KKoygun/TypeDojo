// Challenge: Record<K, V> — buildEnvMap + getEnv
// buildEnvMap: converts [[key, value], ...] pairs into a Record<string, string>
// getEnv: returns value for key, or fallback if absent

export function buildEnvMap(pairs: [string, string][]): Record<string, string> {
  // your implementation — use Object.fromEntries
}

export function getEnv(map: Record<string, string>, key: string, fallback: string): string {
  // your implementation — return fallback if key is absent
}
