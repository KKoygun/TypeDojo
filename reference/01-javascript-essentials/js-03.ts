export function greet(name: string, greeting = "Hello"): string {
  return `${greeting}, ${name}!`
}

export function truncate(str: string, maxLength = 20): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str
}

export function power(base: number, exp = 2): number {
  return base ** exp
}
