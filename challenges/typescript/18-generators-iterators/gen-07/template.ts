// Challenge: lazy generator pipeline

export function* map<T, U>(iterable: Iterable<T>, fn: (val: T) => U): Generator<U> {
  // lazy transform
}

export function* filter<T>(iterable: Iterable<T>, fn: (val: T) => boolean): Generator<T> {
  // lazy filter
}

export function reduce<T, U>(iterable: Iterable<T>, fn: (acc: U, val: T) => U, initial: U): U {
  // collect to single value
}

export function* pipe<T>(...iterables: Array<Iterable<T>>): Generator<T> {
  // concatenate multiple iterables lazily
}

// Demo: sum of even squares from 1..20 using the pipeline above
export function sumEvenSquares(): number {
  // use range (implement inline or import), map, filter, reduce
}
