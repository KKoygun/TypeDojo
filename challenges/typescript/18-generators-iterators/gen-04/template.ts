// Challenge: lazy generator sequences

export function* range(start: number, end: number, step = 1): Generator<number> {
  // yield start, start+step, ... up to (not including) end
}

export function* take<T>(iterable: Iterable<T>, n: number): Generator<T> {
  // yield first n values from iterable
}

export function* fibonacci(): Generator<number> {
  // infinite sequence: 0, 1, 1, 2, 3, 5, 8, ...
}
