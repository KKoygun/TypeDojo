import { checkAll } from "./solution"

let passed = 0
let failed = 0

async function run() {
  const urls = [
    "https://api.example.com",
    "https://db.example.com",
    "https://cache.example.com",
  ]
  const results = await checkAll(urls)

  if (results.length === 3) { passed++ } else { console.error(`  FAIL [length]: ${results.length}`); failed++ }

  for (const url of urls) {
    const r = results.find(x => x.url === url)
    if (r) { passed++ } else { console.error(`  FAIL [missing url]: ${url}`); failed++ }
    if (r?.ok === true) { passed++ } else { console.error(`  FAIL [ok for ${url}]: ${r?.ok}`); failed++ }
  }

  const empty = await checkAll([])
  if (empty.length === 0) { passed++ } else { console.error(`  FAIL [empty]: ${empty.length}`); failed++ }

  if (failed > 0) {
    console.error(`\n  ${failed} test(s) failed`)
    process.exit(1)
  } else {
    console.log(`  ${passed} test(s) passed`)
  }
}

run()
