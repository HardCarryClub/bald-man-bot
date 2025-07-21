import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './app/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:data/database.sqlite',
  },
});
