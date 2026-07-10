// Challenge: abstract BaseHealthChecker + HttpChecker + TcpChecker

export abstract class BaseHealthChecker {
  abstract readonly name: string
  abstract ping(): Promise<boolean>

  async check(): Promise<{ name: string; ok: boolean; latencyMs: number }> {
    // call ping(), measure latency, catch errors → ok: false
  }
}

export class HttpChecker extends BaseHealthChecker {
  // constructor, name, ping()
}

export class TcpChecker extends BaseHealthChecker {
  // constructor, name = "host:port", ping()
}
