// Challenge: generic Repository<T> interface + createRepository factory
// T must have an id: string field
// findById, findAll, save, delete — backed by an in-memory Map

export interface Repository<T extends { id: string }> {
  findById(id: string): T | undefined
  findAll(): T[]
  save(item: T): void
  delete(id: string): boolean
}

export function createRepository<T extends { id: string }>(): Repository<T> {
  // your implementation — store items in a Map<string, T>
}
