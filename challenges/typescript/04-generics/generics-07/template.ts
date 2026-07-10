// Challenge: multiple type parameters — pair, swap, mapFirst
// pair<A, B>: creates a tuple [A, B]
// swap<A, B>: swaps [A, B] to [B, A]
// mapFirst<A, B, C>: applies fn to the first element of [A, B], returns [C, B]

export function pair<A, B>(a: A, b: B): [A, B] {
  // your implementation
}

export function swap<A, B>(p: [A, B]): [B, A] {
  // your implementation
}

export function mapFirst<A, B, C>(p: [A, B], fn: (a: A) => C): [C, B] {
  // your implementation
}
