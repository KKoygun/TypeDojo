export function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}

export function swap<A, B>(p: [A, B]): [B, A] {
  return [p[1], p[0]]
}

export function mapFirst<A, B, C>(p: [A, B], fn: (a: A) => C): [C, B] {
  return [fn(p[0]), p[1]]
}
