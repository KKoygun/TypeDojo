// Challenge: typed error hierarchy + handleError

export class AppError extends Error {
  code: string
  // your implementation
}

export class NetworkError extends AppError {
  statusCode: number
  // your implementation
}

export class ConfigError extends AppError {
  field: string
  // your implementation
}

export function handleError(err: unknown): string {
  // narrow most specific first
}
