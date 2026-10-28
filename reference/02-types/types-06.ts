export function getDirection(degrees: number): "north" | "east" | "south" | "west" {
  if (degrees < 90) return "north"
  if (degrees < 180) return "east"
  if (degrees < 270) return "south"
  return "west"
}
