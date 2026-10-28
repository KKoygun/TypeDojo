export interface Resource {
  id: string
  name: string
  labels: Record<string, string>
}

export interface Deployment extends Resource {
  image: string
  replicas: number
  env?: Record<string, string>
}

export function describeDeployment(d: Deployment): string {
  return `[${d.id}] ${d.name} → ${d.image} x ${d.replicas} replicas`
}
