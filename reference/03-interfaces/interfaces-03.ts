export interface AppConfig {
  name: string
  version: string
  port: number
}

export function formatConfig(config: AppConfig): string {
  return `${config.name} v${config.version} on port ${config.port}`
}
