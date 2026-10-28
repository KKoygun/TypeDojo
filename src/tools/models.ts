// Lists the models the configured provider offers, so AI_MODEL can be set to one that exists.
//   npm run models            all models for AI_PROVIDER
//   npm run models -- llama   only ids containing "llama"
import * as dotenv from "dotenv"
import { resolveProvider } from "../ai"

async function main(): Promise<void> {
  dotenv.config({ quiet: true })
  const resolved = resolveProvider(process.env, false)
  if (!("provider" in resolved)) {
    console.error(`Can't list models: ${resolved.disabled}`)
    process.exit(1)
  }
  const filter = process.argv[2]?.toLowerCase()
  const ids = (await resolved.provider.listModels()).filter((id) => !filter || id.toLowerCase().includes(filter)).sort()
  console.log(`${resolved.provider.name}: ${ids.length} model(s)${filter ? ` matching "${filter}"` : ""}\n`)
  for (const id of ids) console.log(`  ${id}`)
  console.log(`\nSet one as AI_MODEL in .env.`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
