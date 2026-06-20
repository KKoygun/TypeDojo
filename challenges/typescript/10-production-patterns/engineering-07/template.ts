// Challenge: health check aggregator

export interface HealthResult {
  ok: boolean
  latencyMs: number
  error?: string
}

export type HealthReport = Record<string, HealthResult>
export type HealthCheck = () => Promise<HealthResult>

export async function runHealthChecks(checks: Record<string, HealthCheck>): Promise<HealthReport> {
  // run all checks in parallel, record latency, catch errors, never reject
}

export function isHealthy(report: HealthReport): boolean {
  // return true only if ALL checks passed
}

export function summarize(report: HealthReport): string {
  // "3/4 healthy: db(12ms) cache(5ms) queue(FAILED: connection refused) api(8ms)"
}
