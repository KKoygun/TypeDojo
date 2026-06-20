import { z } from 'zod'

// Challenge: validated deployment manifest loader

export const DeploymentSchema = z.object({
  name: z.string().min(1),
  image: z.string(), // must match pattern name:tag
  replicas: z.number().int().min(1).max(20),
  env: z.record(z.string()).optional(),
  resources: z.object({ cpu: z.string(), memory: z.string() }).optional(),
})

export type Deployment = z.infer<typeof DeploymentSchema>

export function loadDeployments(raw: unknown): Deployment[] {
  // validate array of manifests, throw with ALL errors if any fail
}

export function validateAndSummarize(raw: unknown): string {
  // returns 'N valid deployments: name1, name2, ...' or throws
}
