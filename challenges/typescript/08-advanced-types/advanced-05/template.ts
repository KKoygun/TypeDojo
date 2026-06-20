// Challenge: conditional types — UnwrapPromise + DeepReadonly
// Type aliases only, no runtime implementation needed.

export type UnwrapPromise<T> = // if T is Promise<U>, return U; else return T

export type DeepReadonly<T> = // if T is object, readonly + recursive; else T
