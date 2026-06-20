import { checkAll } from "./solution"

let passed = 0
let failed = 0

function assert(condition: boolean, label: string): void {
  if (condition) { passed++ }
  else { console.error(`  FAIL: ${label}`); failed++ }
}

async function main() {
  const results = await checkAll([
    "https://api.example.com",
    "https://down.example.com",
    "https://db.example.com",
    "https://fail.example.com",
  ])

  assert(results.length === 4, "returns result for every URL")
  assert(results.find(r => r.url === "https://api.example.com")?.ok === true, "reachable URL is ok: true")
  assert(results.find(r => r.url === "https://down.example.com")?.ok === false, "down URL is ok: false")
  assert(results.find(r => r.url === "https://db.example.com")?.ok === true, "second reachable URL is ok: true")
  assert(results.find(r => r.url === "https://fail.example.com")?.ok === false, "fail URL is ok: false")

  const allUrls = results.map(r => r.url).sort()
  assert(JSON.stringify(allUrls) === JSON.stringify([
    "https://api.example.com",
    "https://db.example.com",
    "https://down.example.com",
    "https://fail.example.com",
  ]), "all URLs present in results")

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

main()
