// Challenge: typed event emitter shapes using mapped + template literal types

type Events = {
  connect: { host: string }
  disconnect: { code: number }
  error: { message: string }
}

export type EventNames = // keyof Events

export type Handler<E extends EventNames> = // function type with correct payload

export type OnMethods = // { onConnect: Handler<'connect'>, onDisconnect: ..., onError: ... }
                        // derive method names using template literal: `on${Capitalize<K>}`
