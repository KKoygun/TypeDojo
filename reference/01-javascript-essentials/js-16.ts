export function groupBy(
  items: string[],
  keyFn: (item: string) => string
): Record<string, string[]> {
  const groups: Record<string, string[]> = {}
  for (const item of items) {
    const key = keyFn(item)
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }
  return groups
}

export function summarize(students: { name: string; score: number }[]): string {
  const passed = students.filter((s) => s.score >= 50).map((s) => s.name)
  const counts = `(${passed.length}/${students.length})`
  return passed.length === 0 ? `None passed ${counts}` : `Passed: ${passed.join(", ")} ${counts}`
}
