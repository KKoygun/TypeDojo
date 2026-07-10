// Challenge: ReturnType + Parameters — derive types from an existing function
// createServer: already implemented — do not change it
// Derive Server and ServerArgs using ReturnType and Parameters
// restart: creates a new server by spreading ServerArgs

export function createServer(host: string, port: number, debug: boolean) {
  return { host, port, debug, start: () => "started" }
}

export type Server = ReturnType<typeof createServer>
export type ServerArgs = Parameters<typeof createServer>

export function restart(server: Server, args: ServerArgs): Server {
  // your implementation — call createServer with spread args
}
