export interface Repository<T extends { id: string }> {
  findById(id: string): T | undefined
  findAll(): T[]
  save(item: T): void
  delete(id: string): boolean
}

export function createRepository<T extends { id: string }>(): Repository<T> {
  const store = new Map<string, T>()
  return {
    findById: (id) => store.get(id),
    findAll: () => Array.from(store.values()),
    save: (item) => { store.set(item.id, item) },
    delete: (id) => store.delete(id),
  }
}
