export interface AIProvider {
  evaluate(challengeDescription: string, solutionCode: string): Promise<EvalResult>
  insight(challengeDescription: string, solutionCode: string, errorOutput: string): Promise<string>
}

export interface EvalResult {
  pass: boolean
  feedback: string
}
