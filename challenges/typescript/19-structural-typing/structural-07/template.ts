// Challenge: satisfies for typed route config

export interface RouteConfig {
  [path: string]: { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; handler: string }
}

export const routes = {
  '/health':      { method: 'GET',    handler: 'healthHandler' },
  '/api/users':   { method: 'POST',   handler: 'createUserHandler' },
  '/api/users/:id': { method: 'GET',  handler: 'getUserHandler' },
  // add more if you like
} satisfies RouteConfig

export function getHandler(routes: RouteConfig, path: string): string | undefined {
  // return handler for path or undefined
}

export function listRoutes(routes: RouteConfig): string[] {
  // return ['GET /health', 'POST /api/users', ...]
}
