// Challenge: typed middleware chain with intersection types

export type Context = { path: string; method: string; body: unknown }
export type AuthContext = Context & { userId: string; role: 'admin' | 'user' }
export type LoggedContext = Context & { requestId: string; startedAt: number }
export type FullContext = AuthContext & LoggedContext

export type Middleware<In, Out extends In> = (ctx: In) => Out

export function withAuth(ctx: Context): AuthContext {
  // add userId: 'user-123' and role: 'user'
}

export function withLogging(ctx: Context): LoggedContext {
  // add requestId (random 8-char hex) and startedAt (Date.now())
}

export function compose<A, B extends A, C extends B>(
  m1: Middleware<A, B>,
  m2: Middleware<B, C>
): Middleware<A, C> {
  // chain m1 then m2
}

export const fullMiddleware: Middleware<Context, FullContext> = compose(withLogging, withAuth)
