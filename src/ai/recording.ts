// Record/replay for AI calls, so tests and evals can run offline and give the same answer every time.
// A recording ("cassette") is keyed by provider + model + exact prompt. If a prompt changes, the old
// recording no longer matches and replay fails loudly instead of returning a stale answer.
import { createHash } from "crypto"
import * as fs from "fs"
import * as path from "path"
import { AIProvider } from "./provider"

export interface Cassette {
  provider: string
  model: string
  prompt: string
  response: string
  recordedAt: string
}

export function cassetteKey(provider: string, model: string, prompt: string): string {
  return createHash("sha256").update(`${provider}\n${model}\n${prompt}`).digest("hex").slice(0, 16)
}

export class NoRecordingError extends Error {
  constructor(readonly key: string, dir: string) {
    super(`No recorded AI response ${key} in ${dir}. Record it with a real key: npm run ai:record`)
  }
}

function cassettePath(dir: string, key: string): string {
  return path.join(dir, `${key}.json`)
}

// Passes calls through to a real provider and saves every response
export class RecordingProvider implements AIProvider {
  readonly name: string
  readonly model: string

  constructor(private inner: AIProvider, private dir: string) {
    this.name = inner.name
    this.model = inner.model
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.inner.generate(prompt)
    const cassette: Cassette = {
      provider: this.name, model: this.model, prompt, response, recordedAt: new Date().toISOString(),
    }
    fs.mkdirSync(this.dir, { recursive: true })
    fs.writeFileSync(cassettePath(this.dir, cassetteKey(this.name, this.model, prompt)), JSON.stringify(cassette, null, 2) + "\n")
    return response
  }
}

// Answers only from saved recordings. Never touches the network and needs no API key.
export class ReplayProvider implements AIProvider {
  // name and model must match the provider that made the recordings
  constructor(private dir: string, readonly name: string, readonly model: string) {}

  has(prompt: string): boolean {
    return fs.existsSync(cassettePath(this.dir, cassetteKey(this.name, this.model, prompt)))
  }

  async generate(prompt: string): Promise<string> {
    const key = cassetteKey(this.name, this.model, prompt)
    const file = cassettePath(this.dir, key)
    if (!fs.existsSync(file)) throw new NoRecordingError(key, this.dir)
    const cassette: Cassette = JSON.parse(fs.readFileSync(file, "utf-8"))
    return cassette.response
  }
}
