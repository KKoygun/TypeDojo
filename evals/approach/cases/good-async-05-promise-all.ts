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
  const [name, age, role] = await Promise.all([fetchName(), fetchAge(), fetchRole()])
  return `${name}, ${age}, ${role}`
}
