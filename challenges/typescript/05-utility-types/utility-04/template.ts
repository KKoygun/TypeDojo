// Challenge: patch + toPublic using Partial and Omit

interface Deployment { id: string; name: string; image: string; replicas: number }

export function patch(current: Deployment, updates: Partial<Omit<Deployment, 'id'>>): Deployment {
  // merge current with updates — id is never changed
}

export function toPublic(d: Deployment): Omit<Deployment, 'id'> {
  // return everything except id
}
