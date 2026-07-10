// Challenge: destructuring
// initials(person): destructure firstName and lastName, return "F.L." format
//   initials({ firstName: "Alice", lastName: "Smith" }) → "A.S."
// firstAndRest(items): return the first element and the rest as an array
//   firstAndRest(["a", "b", "c"]) → { first: "a", rest: ["b", "c"] }
//   firstAndRest(["only"]) → { first: "only", rest: [] }
//   Tip: use items[0]! (non-null assertion) or items.slice() to satisfy strict TypeScript

export function initials(person: { firstName: string; lastName: string }): string {
  // your implementation
}

export function firstAndRest(items: string[]): { first: string; rest: string[] } {
  // your implementation
  //
  // TypeScript note: after array destructuring, the first element is typed as
  // string | undefined — because TypeScript can't guarantee the array isn't empty.
  // But the return type here requires first: string (no undefined allowed).
  //
  // The ! operator (non-null assertion) resolves this. Place it after any variable
  // to tell TypeScript "trust me, this is not undefined":
  //   someVariable!   ← drops the | undefined from the type
  //
  // It does nothing at runtime — no check, no error. It's a message to the compiler only.
}
