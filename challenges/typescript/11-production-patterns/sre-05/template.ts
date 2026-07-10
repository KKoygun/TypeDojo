// Challenge: structured logger

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
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
  // each method outputs JSON line to stdout with ISO timestamp
}

export function withFields(logger: Logger, fields: Record<string, unknown>): Logger {
  // returns new logger that merges fields into every call
}
