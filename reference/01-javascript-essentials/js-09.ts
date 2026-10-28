export function makePoint(x: number, y: number): { x: number; y: number } {
  return { x, y }
}

export function movePoint(
  point: { x: number; y: number },
  dx: number,
  dy: number
): { x: number; y: number } {
  return { x: point.x + dx, y: point.y + dy }
}

export function mergeSettings(
  defaults: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...defaults, ...overrides }
}
