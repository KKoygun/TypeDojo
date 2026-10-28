export interface DbConfig {
  readonly host: string
  readonly port: number
  readonly dbName: string
}

export function createDbConfig(host: string, port: number, dbName: string): DbConfig {
  return { host, port, dbName }
}
