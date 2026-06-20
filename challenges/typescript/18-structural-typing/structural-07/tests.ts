import { routes, getHandler, listRoutes } from "./solution"

let p = 0, f = 0
const ok = (c: boolean, l: string) => c ? p++ : (console.error(`  FAIL: ${l}`), f++)

ok(typeof routes === "object", "routes is object")
ok('/health' in routes, "routes has /health")
ok('/api/users' in routes, "routes has /api/users")

ok(getHandler(routes, '/health') === 'healthHandler', "getHandler /health")
ok(getHandler(routes, '/api/users') === 'createUserHandler', "getHandler /api/users")
ok(getHandler(routes, '/nonexistent') === undefined, "getHandler missing returns undefined")

const list = listRoutes(routes)
ok(Array.isArray(list), "listRoutes returns array")
ok(list.some(r => r === 'GET /health'), "listRoutes includes GET /health")
ok(list.some(r => r === 'POST /api/users'), "listRoutes includes POST /api/users")
ok(list.every(r => /^(GET|POST|PUT|DELETE) \//.test(r)), "all routes have method prefix")

if (f > 0) { console.error(`\n  ${f} test(s) failed`); process.exit(1) }
else console.log(`  ${p} test(s) passed`)
