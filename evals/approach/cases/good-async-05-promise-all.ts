const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function fetchName(): Promise<string> {
  await delay(50)
  return "Alice"
}

export async function fetchAge(): Promise<number> {
  await delay(50)
  return 30
}

export async function fetchRole(): Promise<string> {
  await delay(50)
  return "admin"
}

export async function fetchAll(): Promise<string> {
  const [name, age, role] = await Promise.all([fetchName(), fetchAge(), fetchRole()])
  return `${name}, ${age}, ${role}`
}
