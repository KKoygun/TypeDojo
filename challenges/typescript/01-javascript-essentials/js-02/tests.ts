import { normalize, toSlug, hasWord } from "./solution"

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

check("normalize trims and lowercases", normalize("  Hello  "), "hello")
check("normalize already clean", normalize("world"), "world")
check("normalize spaces only", normalize("   "), "")
check("normalize mixed case", normalize("  TypeScript  "), "typescript")

check("toSlug two words", toSlug("Hello World"), "hello-world")
check("toSlug three words", toSlug("The Quick Fox"), "the-quick-fox")
check("toSlug already lowercase", toSlug("already done"), "already-done")

check("hasWord found", hasWord("The cat sat on the mat", "cat"), true)
check("hasWord not found", hasWord("The cat sat on the mat", "dog"), false)
check("hasWord case insensitive sentence", hasWord("Hello World", "hello"), true)
check("hasWord case insensitive word", hasWord("Hello World", "WORLD"), true)

if (failed > 0) {
  console.error(`\n  ${failed} test(s) failed`)
  process.exit(1)
} else {
  console.log(`  ${passed} test(s) passed`)
}
