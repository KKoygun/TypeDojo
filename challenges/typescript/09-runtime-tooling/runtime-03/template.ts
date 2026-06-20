// Challenge: manual config validator

interface AppConfig {
  host: string
  port: number
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  workers?: number
}

export function parseConfig(raw: unknown): AppConfig {
  // validate shape and types, throw descriptive errors, default workers to 1
}
