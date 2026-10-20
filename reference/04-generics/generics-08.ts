export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => getProperty(item, key))
}
