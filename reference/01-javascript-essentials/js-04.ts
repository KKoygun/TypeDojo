export function isAdult(age: number): boolean {
  return age >= 18
}

export function canAccess(age: number, hasTicket: boolean, isVIP: boolean): boolean {
  return (age >= 18 && hasTicket) || isVIP
}

export function categorize(n: number): string {
  if (n === 0) return "zero"
  const sign = n > 0 ? "positive" : "negative"
  const parity = n % 2 === 0 ? "even" : "odd"
  return `${sign} ${parity}`
}
