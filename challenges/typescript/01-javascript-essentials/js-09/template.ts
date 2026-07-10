// Challenge: objects — create, spread, merge
// makePoint(x, y): return { x, y } using property shorthand
// movePoint(point, dx, dy): return a NEW point shifted by dx and dy — do not modify the original
//   movePoint({ x: 1, y: 2 }, 3, -1) → { x: 4, y: 1 }
// mergeSettings(defaults, overrides): merge two objects — overrides win on any key conflict
//   mergeSettings({ a: "1", b: "2" }, { b: "99" }) → { a: "1", b: "99" }

export function makePoint(x: number, y: number): { x: number; y: number } {
  // your implementation
}

export function movePoint(
  point: { x: number; y: number },
  dx: number,
  dy: number
): { x: number; y: number } {
  // your implementation
}

export function mergeSettings(
  defaults: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  // your implementation
}
