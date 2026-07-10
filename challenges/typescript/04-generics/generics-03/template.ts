// Challenge: generic Wrapper<T> interface + wrap + unwrap
// Wrapper<T>: interface with a single field value: T
// wrap: takes a value, returns an object { value: theValue } typed as Wrapper<T>
// unwrap: takes a Wrapper<T>, returns the value field from inside it

export interface Wrapper<T> {
  // your property here
}

export function wrap<T>(value: T): Wrapper<T> {
  // your implementation
}

export function unwrap<T>(wrapped: Wrapper<T>): T {
  // your implementation
}
