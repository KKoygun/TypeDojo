export function sumOf(nums: number[]): number {
  let total = 0
  for (const n of nums) {
    total += n
  }
  return total
}

export function longestWord(words: string[]): string {
  let longest = ""
  for (const word of words) {
    if (word.length > longest.length) longest = word
  }
  return longest
}

export function pipeline(nums: number[]): number[] {
  return nums.filter((n) => n > 0).map((n) => n * n)
}
