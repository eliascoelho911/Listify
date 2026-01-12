import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infra/drizzle/schema.ts',
  out: './src/infra/drizzle/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
