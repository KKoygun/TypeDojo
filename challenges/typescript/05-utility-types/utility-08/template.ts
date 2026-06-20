// Challenge: compose utility types + makeEnvMap
// No new interface declarations — use only utility types

interface ServiceSpec { id: string; name: string; image: string; port: number; secret: string; replicas: number }

export type PublicSpec = // Omit id and secret
export type PatchSpec =  // All PublicSpec fields optional
export type EnvMap =     // Record mapping 'prod' | 'staging' | 'dev' to PublicSpec

export function makeEnvMap(specs: PublicSpec[]): EnvMap {
  // specs[0] = prod, specs[1] = staging, specs[2] = dev
}
