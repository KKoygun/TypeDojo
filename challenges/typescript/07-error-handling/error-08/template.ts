// Challenge: tryCatch + runAll + countResults

export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

export async function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T>> {
  // never throws — always returns a Result
}

export async function runAll<T>(tasks: Array<() => Promise<T>>): Promise<Result<T>[]> {
  // run all in parallel, return all results
}

export function countResults<T>(results: Result<T>[]): { passed: number; failed: number } {
  // count ok: true vs ok: false
}
