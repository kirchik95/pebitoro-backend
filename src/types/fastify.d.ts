import 'fastify';
import '@fastify/jwt';

import { JWT } from '@fastify/jwt';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from '@db/schema';

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle<typeof schema>>;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    jwt: JWT;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: { id: number };
  }
}
