import { EventNames, Handler, OnMethods } from "./solution"

// Compile-time checks
const name: EventNames = "connect"  // must be 'connect' | 'disconnect' | 'error'

const h: Handler<'connect'> = (payload) => {
  const host: string = payload.host  // payload must be { host: string }
}

const emitter: OnMethods = {
  onConnect: (p) => { const _: string = p.host },
  onDisconnect: (p) => { const _: number = p.code },
  onError: (p) => { const _: string = p.message },
}

let passed = 0
console.log("  Type checks passed at compile time")
passed++
console.log(`  ${passed} test(s) passed`)
