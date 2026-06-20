// Challenge: as const arrays → derived union types + type guards

export const ENVIRONMENTS = ['prod', 'staging', 'dev'] as const
export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const

export type Environment = // derive from ENVIRONMENTS
export type LogLevel =    // derive from LOG_LEVELS

export function isEnvironment(val: unknown): val is Environment {
  // type guard using the ENVIRONMENTS array
}

export function isLogLevel(val: unknown): val is LogLevel {
  // type guard using the LOG_LEVELS array
}

export function parseEnv(val: unknown): Environment {
  // use isEnvironment, throw descriptive error if invalid
}

export function parseLogLevel(val: unknown): LogLevel {
  // use isLogLevel, throw descriptive error if invalid
}
