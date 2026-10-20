export function initials(person: { firstName: string; lastName: string }): string {
  const { firstName, lastName } = person
  return `${firstName.charAt(0)}.${lastName.charAt(0)}.`
}

export function firstAndRest(items: string[]): { first: string; rest: string[] } {
  const [first, ...rest] = items
  return { first: first!, rest }
}
