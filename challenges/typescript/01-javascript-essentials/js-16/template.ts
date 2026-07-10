// Challenge: bring it together
// groupBy(items, keyFn): group strings into buckets by key
//   groupBy(["cat", "car", "dog"], w => w.charAt(0)) → { c: ["cat", "car"], d: ["dog"] }
// summarize(students): given { name, score }[] return a result string
//   passing score is >= 50
//   "Passed: Alice, Bob (2/3)" — or "None passed (0/3)" if nobody passes

export function groupBy(
  items: string[],
  keyFn: (item: string) => string
): Record<string, string[]> {
  // your implementation
}

export function summarize(students: { name: string; score: number }[]): string {
  // your implementation
}
