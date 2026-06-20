// Challenge: type guards + area + assertShape

export type Circle = { kind: 'circle'; radius: number }
export type Rectangle = { kind: 'rectangle'; width: number; height: number }
export type Triangle = { kind: 'triangle'; base: number; height: number }
export type Shape = Circle | Rectangle | Triangle

export function isCircle(s: unknown): s is Circle {
  // your type guard
}

export function isRectangle(s: unknown): s is Rectangle {
  // your type guard
}

export function area(shape: Shape): number {
  // circle: π * r², rectangle: w*h, triangle: 0.5*b*h
}

export function assertShape(val: unknown): asserts val is Shape {
  // throw if val is not a valid Shape
}
