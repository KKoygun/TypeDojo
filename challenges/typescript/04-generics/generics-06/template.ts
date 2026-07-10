// Challenge: ApiResponse<T> generic interface + success + failure helpers
// ApiResponse<T>: { data: T; status: number; error?: string }
// success: wraps data in a 200 response — use the data parameter, not a hardcoded value
// failure: creates a 500 response with null data — use the error parameter as the error field

export interface ApiResponse<T> {
  // your fields here
}

export function success<T>(data: T): ApiResponse<T> {
  // your implementation
}

export function failure<T>(error: string): ApiResponse<T | null> {
  // your implementation
}
