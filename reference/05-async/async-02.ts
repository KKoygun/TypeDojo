export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function greetAfterDelay(name: string, ms: number): Promise<string> {
  await delay(ms)
  return `Hello, ${name}!`
}
