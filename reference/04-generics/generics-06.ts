export interface ApiResponse<T> {
  data: T
  status: number
  error?: string
}

export function success<T>(data: T): ApiResponse<T> {
  return { data, status: 200 }
}

export function failure<T>(error: string): ApiResponse<T | null> {
  return { data: null, status: 500, error }
}
