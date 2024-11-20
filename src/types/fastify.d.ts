import 'fastify';

import { JWT } from '@fastify/jwt';
import { drizzle } from 'drizzle-orm/node-postgres';

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle>;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    jwt: JWT;
  }
}
