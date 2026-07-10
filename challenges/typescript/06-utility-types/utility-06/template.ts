// Challenge: Required<T> — withDefaults fills in missing options
// PartialOptions: all four fields optional
// withDefaults: fills in defaults and returns Required<PartialOptions>

export interface PartialOptions {
  timeout?: number
  retries?: number
  baseUrl?: string
  debug?: boolean
}

export function withDefaults(options: PartialOptions): Required<PartialOptions> {
  // your implementation — merge defaults with provided options
  // defaults: timeout=5000, retries=3, baseUrl="http://localhost", debug=false
}
