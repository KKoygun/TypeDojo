// Challenge: labeled tuples and rest elements

type HttpResponse = [status: number, body: string, headers: Record<string, string>]

export function httpResponse(body: string, headers?: Record<string, string>): HttpResponse {
  // return 200, body, headers (default empty object)
}

export function spread<T extends unknown[]>(first: string, ...rest: T): [string, ...T] {
  // prepend first to rest
}

export function zipPairs(keys: string[], values: number[]): [string, number][] {
  // pair by index, stop at shorter array
}
