// Challenge: structured logger

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  service: string
  fields?: Record<string, unknown>
}

export interface Logger {
  debug(message: string, fields?: Record<string, unknown>): void
  info(message: string, fields?: Record<string, unknown>): void
  warn(message: string, fields?: Record<string, unknown>): void
  error(message: string, fields?: Record<string, unknown>): void
}

export function createLogger(service: string): Logger {
  // each method writes a JSON line to stdout with current ISO timestamp
}

export function withFields(logger: Logger, fields: Record<string, unknown>): Logger {
  // returns a new logger that merges the given fields into every log call
}
