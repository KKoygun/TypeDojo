import { z } from 'zod'

// Challenge: Zod config schema with inferred type

export const AppConfigSchema = z.object({
  // host: non-empty string
  // port: integer 1–65535
  // logLevel: enum of debug/info/warn/error
  // workers: positive integer, optional, default 1
  // tags: string array, optional, default []
})

export type AppConfig = z.infer<typeof AppConfigSchema>

export function parseAppConfig(raw: unknown): AppConfig {
  // use safeParse, throw with Zod error message on failure
}
