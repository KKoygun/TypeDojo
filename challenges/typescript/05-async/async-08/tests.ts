import { fetchWithTimeout } from "./solution"

let passed = 0
let failed = 0

async function run() {
  const result = await fetchWithTimeout("https://example.com", 1000)
  if (result === "https://example.com") { passed++ } else { console.error(`  FAIL [result]: "${result}"`); failed++ }

  const result2 = await fetchWithTimeout("https://api.example.com/health", 500)
  if (result2 === "https://api.example.com/health") { passed++ } else { console.error(`  FAIL [result2]: "${result2}"`); failed++ }

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

run()
