// Challenge: write mapped type utilities (no built-in utility types)

export type MyPartial<T> = // your mapped type

export type MyReadonly<T> = // your mapped type

export type Nullable<T> = // your mapped type

export type Stringify<T> = // your mapped type

export function toStrings<T extends Record<string, unknown>>(obj: T): Stringify<T> {
  // convert each value with String()
}
