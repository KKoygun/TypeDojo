export interface ServiceConfig {
  host: string
  port: number
  timeout?: number
  retries?: number
}

export function buildUrl(config: ServiceConfig): string {
  return `http://${config.host}:${config.port}`
}
