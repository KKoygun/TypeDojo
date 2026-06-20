import { fetchWithTimeout } from "./solution"

let passed = 0
let failed = 0

function assert(condition: boolean, label: string): void {
  if (condition) { passed++ }
  else { console.error(`  FAIL: ${label}`); failed++ }
}

// Mock fetch globally
let simulatedDelay = 0
let mockBody = "response body"

;(global as any).fetch = async (url: string, opts?: { signal?: AbortSignal }): Promise<{ text: () => Promise<string> }> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve({ text: async () => mockBody })
    }, simulatedDelay)

    opts?.signal?.addEventListener("abort", () => {
      clearTimeout(timer)
      const err = new Error("The operation was aborted")
      ;(err as any).name = "AbortError"
      reject(err)
    })
  })
}

async function main() {
  // fast fetch — should succeed
  simulatedDelay = 10
  mockBody = "hello"
  const result = await fetchWithTimeout("https://example.com", 200)
  assert(result === "hello", "returns response body on success")

  // slow fetch — should timeout
  simulatedDelay = 300
  let threw = false
  let errorMsg = ""
  try {
    await fetchWithTimeout("https://slow.example.com", 50)
  } catch (e) {
    threw = true
    errorMsg = e instanceof Error ? e.message : ""
  }
  assert(threw, "throws on timeout")
  assert(errorMsg === "Request timed out: https://slow.example.com", `timeout error message correct (got: "${errorMsg}")`)

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

main()
