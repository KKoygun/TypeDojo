// Challenge: health check aggregator

export interface HealthResult { ok: boolean; latencyMs: number; error?: string }
export type HealthReport = Record<string, HealthResult>
export type HealthCheck = () => Promise<HealthResult>

export async function runHealthChecks(checks: Record<string, HealthCheck>): Promise<HealthReport> {
  // run all in parallel, track latency, catch errors, never reject
}

export function isHealthy(report: HealthReport): boolean {
  // true only if all checks ok
}

export function summarize(report: HealthReport): string {
  // "X/Y healthy: name(Xms) name(FAILED: error) ..."
}
