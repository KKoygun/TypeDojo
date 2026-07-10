// Challenge: typed mock system

export type MockFn<T extends (...args: any[]) => any> = T & {
  calls: Parameters<T>[]
  returnValues: ReturnType<T>[]
  mockReturnValue(val: ReturnType<T>): void
  reset(): void
}

export function createMock<T extends (...args: any[]) => any>(impl?: T): MockFn<T> {
  // record calls and return values
  // support mockReturnValue override
  // support reset()
}
