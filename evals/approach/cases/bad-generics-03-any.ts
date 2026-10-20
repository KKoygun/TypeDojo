export interface Wrapper<T> {
  value: any
}

export function wrap<T>(value: T): Wrapper<T> {
  return { value }
}

export function unwrap<T>(wrapped: Wrapper<T>): T {
  return wrapped.value
}
