export function sumOf(nums: number[]): number {
  return nums.reduce((total, n) => total + n, 0)
}

export function longestWord(words: string[]): string {
  return words.reduce((longest, word) => (word.length > longest.length ? word : longest), "")
}

export function pipeline(nums: number[]): number[] {
  return nums.filter((n) => n > 0).map((n) => n * n)
}
