import { emit, on } from "./solution"

let passed = 0
let failed = 0

function check(label: string, got: unknown, expected: unknown): void {
  if (got === expected) {
    passed++
  } else {
    console.error(`  FAIL [${label}]: got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`)
    failed++
  }
}

const e1 = emit("userCreated", { id: "1", name: "Alice" })
check("emit userCreated", e1, `userCreated:${JSON.stringify({ id: "1", name: "Alice" })}`)

const e2 = emit("orderPlaced", { orderId: "ORD-42", total: 99.99 })
check("emit orderPlaced", e2, `orderPlaced:${JSON.stringify({ orderId: "ORD-42", total: 99.99 })}`)

const e3 = emit("error", { code: 500, message: "Internal server error" })
check("emit error", e3, `error:${JSON.stringify({ code: 500, message: "Internal server error" })}`)

let received: unknown = null
on("userCreated", payload => { received = payload })
check("on calls handler", JSON.stringify(received), JSON.stringify({ id: "1", name: "Alice" }))

let receivedOrder: unknown = null
on("orderPlaced", payload => { receivedOrder = payload.total })
check("on orderPlaced total", receivedOrder, 99.99)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
