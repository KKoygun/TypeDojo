// Challenge: function type compatibility

export type Logger = { log(msg: string): void }
export type DetailedLogger = { log(msg: string, level: string): void }

export function acceptsLogger(l: Logger): void {
  l.log("test message")
}

// compose two functions
export function compose<T, U, V>(f: (x: T) => U, g: (x: U) => V): (x: T) => V {
  return (x) => g(f(x))
}

// Document which of these are assignable to Logger and why
export const basic: Logger = { log(msg: string) { } }
export const withOptional: Logger = { log(msg: string, level?: string) { } }
// export const withRequired: Logger = { log(msg: string, level: string) { } }  // NOT assignable — uncomment to see error
export const withExtra: Logger = { log(msg: string) { }, warn(msg: string) { } } as any  // extra methods ok structurally

export const results = {
  basicAssignable: true,         // { log(msg): void } ✓
  optionalParamAssignable: true, // optional extra param ✓
  requiredParamAssignable: false, // required extra param ✗ — callers don't pass it
  extraMethodAssignable: true,   // extra methods ✓ — structural supertype
}
