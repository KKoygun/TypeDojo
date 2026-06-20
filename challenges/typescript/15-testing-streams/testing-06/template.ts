// Challenge: typed test runner

export interface TestResult { name: string; passed: boolean; error?: string; durationMs: number }
export interface SuiteResult { suite: string; results: TestResult[]; passed: number; failed: number; totalMs: number }

export function assert<T>(actual: T, expected: T, label?: string): void {
  // throw if actual !== expected
}

export async function test(name: string, fn: () => void | Promise<void>): Promise<TestResult> {
  // run fn, catch errors, measure duration
}

export async function suite(name: string, tests: Record<string, () => void | Promise<void>>): Promise<SuiteResult> {
  // run all tests sequentially, collect results
}

export function printSuite(result: SuiteResult): void {
  // print formatted summary to stdout
}
