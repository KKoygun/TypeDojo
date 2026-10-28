export function doubleAll(nums: number[]): number[] {
  return nums.map((n) => n * 2)
}

export function onlyPositive(nums: number[]): number[] {
  return nums.filter((n) => n > 0)
}

export function firstLetters(words: string[]): string[] {
  return words.map((word) => word.charAt(0))
}
