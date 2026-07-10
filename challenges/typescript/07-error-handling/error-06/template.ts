// Challenge: discriminated union error handler

export type ServiceError =
  | { kind: 'network'; statusCode: number; url: string }
  | { kind: 'timeout'; url: string; durationMs: number }
  | { kind: 'config'; field: string; reason: string }

export function formatError(err: ServiceError): string {
  // network: "HTTP statusCode at url"
  // timeout: "Timeout after durationMsms at url"
  // config: "Invalid config field 'field': reason"
}

export function shouldRetry(err: ServiceError): boolean {
  // network >= 500: true, timeout: true, else: false
  // use exhaustive switch with never guard
}
