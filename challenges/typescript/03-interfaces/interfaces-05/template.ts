// Challenge: DbConfig interface with readonly properties + createDbConfig
// Add readonly to each property: host (string), port (number), dbName (string)

export interface DbConfig {
  // your readonly properties here
}

export function createDbConfig(host: string, port: number, dbName: string): DbConfig {
  // your implementation
}
