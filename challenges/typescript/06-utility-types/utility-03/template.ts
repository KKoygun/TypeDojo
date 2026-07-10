// Challenge: Readonly<T> — immutable config
// DatabaseConfig: host, port, name, user, password
// freezeConfig: returns config as Readonly<DatabaseConfig>
// describeConfig: returns "user@host:port/name"

export interface DatabaseConfig {
  host: string
  port: number
  name: string
  user: string
  password: string
}

export function freezeConfig(config: DatabaseConfig): Readonly<DatabaseConfig> {
  // your implementation
}

export function describeConfig(config: Readonly<DatabaseConfig>): string {
  // your implementation — "user@host:port/name"
}
