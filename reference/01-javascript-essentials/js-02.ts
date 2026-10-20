export function normalize(str: string): string {
  return str.trim().toLowerCase()
}

export function toSlug(str: string): string {
  return str.toLowerCase().split(" ").join("-")
}

export function hasWord(sentence: string, word: string): boolean {
  return sentence.toLowerCase().includes(word.toLowerCase())
}
