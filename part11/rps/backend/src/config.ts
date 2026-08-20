function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  legacyApi: {
    baseUrl: requireEnv('LEGACY_API_URL'),
    apiToken: requireEnv('LEGACY_API_TOKEN'),
  },
  db: {
    host: requireEnv('POSTGRES_HOST'),
    user: requireEnv('POSTGRES_USER'),
    password: requireEnv('POSTGRES_PASSWORD'),
    db: requireEnv('POSTGRES_DB'),
  },
  logger: {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  },
};
