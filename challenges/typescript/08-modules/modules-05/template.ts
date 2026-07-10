// Challenge: write type declarations for the legacy metrics.js module
// Export the types below — no runtime implementation needed.

export type MetricName = string

export declare function increment(name: MetricName, value?: number): void
export declare function gauge(name: MetricName, value: number): void
export declare function timing(name: MetricName, durationMs: number): void
