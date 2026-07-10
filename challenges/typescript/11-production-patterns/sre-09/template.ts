// Challenge: typed deployment pipeline

export type Stage = 'build' | 'test' | 'deploy' | 'verify'
export type StageStatus = 'pending' | 'running' | 'passed' | 'failed'

export interface StageResult { stage: Stage; status: StageStatus; durationMs: number; output: string }
export interface PipelineResult { stages: StageResult[]; success: boolean; totalMs: number }
export type StageRunner = (stage: Stage) => Promise<{ output: string }>

export async function runPipeline(stages: Stage[], runner: StageRunner): Promise<PipelineResult> {
  // run sequentially, stop on failure, remaining stages stay pending
}

export function formatPipeline(result: PipelineResult): string {
  // "Pipeline: passed/failed (Xms)\n  ✓ build (120ms)\n  ✗ deploy (50ms)\n  - verify (pending)"
}
