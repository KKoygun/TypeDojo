// Challenge: combining utility types — PublicService + ServicePatch
// Service: id, name, endpoint, apiKey, timeout?, retries?
// PublicService = Readonly<Omit<Service, 'apiKey'>>
// ServicePatch = Partial<Omit<Service, 'id' | 'apiKey'>>
// toPublic: converts Service → PublicService
// applyPatch: merges patch into service, returns updated Service

export interface Service {
  id: string
  name: string
  endpoint: string
  apiKey: string
  timeout?: number
  retries?: number
}

export type PublicService = Readonly<Omit<Service, "apiKey">>
export type ServicePatch = Partial<Omit<Service, "id" | "apiKey">>

export function toPublic(s: Service): PublicService {
  // your implementation
}

export function applyPatch(s: Service, patch: ServicePatch): Service {
  // your implementation
}
