// Challenge: ConnectionPool class

export class ConnectionPool {
  // your private/readonly fields here

  constructor(maxSize: number) {
    // initialize
  }

  public add(conn: string): void {
    // add connection or throw 'Pool is full'
  }

  public remove(conn: string): void {
    // remove or throw 'Connection not found'
  }

  public get size(): number {
    // return current count
  }

  public get available(): number {
    // return maxSize - size
  }

  public list(): readonly string[] {
    // return readonly view of connections
  }
}
