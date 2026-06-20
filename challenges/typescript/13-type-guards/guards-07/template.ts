// Challenge: assertion functions for startup validation

interface AppConfig {
  host: string
  port: number
  workers: number
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

export function assertDefined<T>(val: T | undefined | null, name: string): asserts val is T {
  // throw if val is undefined or null
}

export function assertPort(val: unknown): asserts val is number {
  // must be integer 1–65535
}

export function assertLogLevel(val: unknown): asserts val is AppConfig['logLevel'] {
  // must be one of the four valid values
}

export function assertConfig(raw: unknown): asserts raw is AppConfig {
  // validate full shape using the above helpers
}
