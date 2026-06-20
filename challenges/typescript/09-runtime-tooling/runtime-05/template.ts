// Challenge: typed env loader suite

export function getEnv(key: string, fallback?: string): string {
  // return env var, fallback, or throw
}

export function getEnvInt(key: string, fallback?: number): number {
  // parse as integer, throw if invalid
}

export function getEnvBool(key: string, fallback?: boolean): boolean {
  // 'true'/'1' → true, 'false'/'0' → false, throw otherwise
}

export function getEnvEnum<T extends string>(key: string, values: T[], fallback?: T): T {
  // validate against allowed values
}
