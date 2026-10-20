export async function fetchName(): Promise<string> {
  return "Alice"
}

export async function fetchAge(): Promise<number> {
  return 30
}

export async function fetchRole(): Promise<string> {
  return "admin"
}

export async function fetchAll(): Promise<string> {
  const name = await fetchName()
  const age = await fetchAge()
  const role = await fetchRole()
  return `${name}, ${age}, ${role}`
}
