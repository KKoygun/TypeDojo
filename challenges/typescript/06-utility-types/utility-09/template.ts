// Challenge: typed event system using keyof + indexed access
// EventName: keyof EventMap
// EventPayload<K>: the payload type for event K
// emit: returns "event:JSON.stringify(payload)"
// on: calls handler immediately with payload

interface EventMap {
  userCreated: { id: string; name: string }
  orderPlaced: { orderId: string; total: number }
  error: { code: number; message: string }
}

export type EventName = keyof EventMap

export type EventPayload<K extends EventName> = EventMap[K]

export function emit<K extends EventName>(event: K, payload: EventPayload<K>): string {
  // your implementation
}

export function on<K extends EventName>(event: K, handler: (payload: EventPayload<K>) => void): void {
  // your implementation — call handler with payload
}
