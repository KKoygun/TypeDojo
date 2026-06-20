// Challenge: module augmentation for process.env + loadAppEnv

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // augment with APP_ENV, LOG_LEVEL, PORT, DB_URL
    }
  }
}

export function loadAppEnv(): { appEnv: string; logLevel: string; port: number; dbUrl: string } {
  // read from process.env with defaults:
  // APP_ENV → 'development'
  // LOG_LEVEL → 'info'
  // PORT → 3000 (parse as int)
  // DB_URL → throw 'Missing DB_URL'
}

export {}
