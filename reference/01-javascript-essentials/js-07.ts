export function formatGreeting(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`
}

export function formatPath(dir: string, file: string, ext: string): string {
  return `${dir}/${file}.${ext}`
}
