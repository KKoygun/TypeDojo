// Challenge: Partial<T> — updateConfig
// ServerConfig: host, port, maxConnections, debug
// updateConfig: merges changes (Partial) into the existing config

export interface ServerConfig {
  host: string
  port: number
  maxConnections: number
  debug: boolean
}

export function updateConfig(config: ServerConfig, changes: Partial<ServerConfig>): ServerConfig {
  // your implementation — merge changes into config
}
