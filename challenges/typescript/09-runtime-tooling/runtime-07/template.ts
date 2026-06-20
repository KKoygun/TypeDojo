// Challenge: minimal CLI arg parser

export function parseArgs(argv: string[]): Record<string, string | boolean> {
  // skip argv[0] and argv[1]
  // --key value → { key: 'value' }
  // --flag (no value) → { flag: true }
}
