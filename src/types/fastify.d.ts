import 'fastify';

import { drizzle } from 'drizzle-orm/node-postgres';

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle>;
  }
}
