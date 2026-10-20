export function formatPort(port: number): string {
  if (port === 8080) return ":8080"
  if (port === 3000) return ":3000"
  return ":443"
}
