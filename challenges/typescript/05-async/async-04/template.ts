// Challenge: async pipeline — fetchNumber → doubleAsync → pipeline
// fetchNumber: resolves with 42
// doubleAsync: resolves with n * 2
// pipeline: chains them and returns "Result: 84"

export async function fetchNumber(): Promise<number> {
  // your implementation — resolve with 42
}

export async function doubleAsync(n: number): Promise<number> {
  // your implementation — resolve with n * 2
}

export async function pipeline(): Promise<string> {
  // your implementation — chain fetchNumber and doubleAsync
}
