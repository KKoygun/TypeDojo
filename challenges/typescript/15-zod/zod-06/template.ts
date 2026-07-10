import { z } from 'zod'

// Challenge: Zod transforms and refinements

export const PortSchema = z.union([z.string(), z.number()])
  // .transform(Number)
  // .refine(n => n >= 1 && n <= 65535, { message: 'Port must be 1–65535' })

export const UrlSchema = z.string()
  // .refine(s => ..., { message: 'Must be http:// or https://' })

export const EnvSchema = z.object({
  PORT: PortSchema,
  API_URL: UrlSchema,
  LOG_LEVEL: z.string(), // transform to lowercase, then validate
  DEBUG: z.string(),     // '0'|'1' → boolean
})

export type Env = z.infer<typeof EnvSchema>
