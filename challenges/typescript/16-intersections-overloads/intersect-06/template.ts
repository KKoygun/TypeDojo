// Challenge: function overloads

export function format(value: string): string
export function format(value: number): string
export function format(value: boolean): string
export function format(value: string | number | boolean): string {
  // implement all three cases
}

export function lookup(map: Record<string, string>, key: string): string
export function lookup(map: Record<string, string>, key: string, fallback: string): string
export function lookup(map: Record<string, string>, key: string, fallback?: string): string {
  // return map[key] or fallback or throw
}

export function coerce(val: string): number
export function coerce(val: number): string
export function coerce(val: string | number): string | number {
  // convert between string and number
}
