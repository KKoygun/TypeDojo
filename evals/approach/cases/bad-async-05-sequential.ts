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
  const name = await fetchName()
  const age = await fetchAge()
  const role = await fetchRole()
  return `${name}, ${age}, ${role}`
}
