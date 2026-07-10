# Utility Types

TypeScript ships with built-in type transformers that derive new types from existing ones — no duplication needed.

---

## Partial<T>

Makes all properties optional:

```
interface Config { host: string; port: number }

function update(config: Config, changes: Partial<Config>): Config {
  return { ...config, ...changes }
}

update(config, { port: 9090 })   // only port changes — host stays
```

---

## Required<T>

The opposite — makes all optional properties required:

```
interface Options { timeout?: number; retries?: number }

type FullOptions = Required<Options>
// { timeout: number; retries: number }
```

---

## Readonly<T>

Prevents mutation of all properties:

```
const config: Readonly<Config> = { host: "localhost", port: 8080 }
config.port = 9090   // error: cannot assign to read-only property
```

---

## Pick<T, K> and Omit<T, K>

Pick keeps only the listed keys. Omit removes them:

```
interface Service { id: string; name: string; secret: string }

type PublicService = Omit<Service, "secret">
// { id: string; name: string }

type NameOnly = Pick<Service, "name">
// { name: string }
```

---

## Record<K, V>

A typed dictionary — keys are K, values are V:

```
type EnvMap = Record<"prod" | "staging" | "dev", string>
// { prod: string; staging: string; dev: string }

const urls: EnvMap = {
  prod:    "https://api.example.com",
  staging: "https://staging.example.com",
  dev:     "http://localhost:3000",
}
```

---

## ReturnType<T> and Parameters<T>

Extract types from an existing function without duplicating them:

```
function createServer(host: string, port: number) {
  return { host, port, start: () => {} }
}

type Server = ReturnType<typeof createServer>
// { host: string; port: number; start: () => void }

type ServerArgs = Parameters<typeof createServer>
// [string, number]
```

---

You can return to this screen any time from the challenge menu.
