import { withAuth, withLogging, compose, fullMiddleware } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

const base = { path: '/api', method: 'GET', body: null }

const authed = withAuth(base)
ok(authed.path === '/api', "withAuth preserves path")
ok(authed.userId === 'user-123', "withAuth adds userId")
ok(authed.role === 'user', "withAuth adds role")

const logged = withLogging(base)
ok(logged.path === '/api', "withLogging preserves path")
ok(typeof logged.requestId === 'string' && logged.requestId.length === 8, "withLogging adds 8-char requestId")
ok(typeof logged.startedAt === 'number', "withLogging adds startedAt")

const double = compose(withLogging, withAuth)
const ctx = double(base)
ok(ctx.userId === 'user-123', "composed has userId")
ok(typeof ctx.requestId === 'string', "composed has requestId")
ok(ctx.path === '/api', "composed preserves path")

const full = fullMiddleware(base)
ok(full.userId === 'user-123', "fullMiddleware userId")
ok(typeof full.requestId === 'string', "fullMiddleware requestId")
ok(full.role === 'user', "fullMiddleware role")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
