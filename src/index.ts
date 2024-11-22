import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import dotenv from 'dotenv';

import authenticate from '@plugins/authenticate';
import db from '@plugins/db';

import authRoutes from '@modules/auth/auth.routes';
import taskRoutes from '@modules/tasks/tasks.route';

dotenv.config();

const fastify = Fastify({
  logger:
    process.env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }
      : true,
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(jwt, {
  secret: process.env.JWT_SECRET!,
});
fastify.register(helmet);

fastify.register(db);
fastify.register(authenticate);

fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(taskRoutes, { prefix: '/api/tasks' });

const server = async () => {
  try {
    await fastify.listen({
      port: Number(process.env.PORT) || 3000,
      host: process.env.HOST || '0.0.0.0',
    });

    console.log(
      `Server is running on: http://${process.env.HOST || '0.0.0.0'}:${Number(
        process.env.PORT || 3000,
      )}`,
    );
  } catch (err) {
    console.log('Error starting server:', err);
    fastify.log.error(err);
    process.exit(1);
  }
};

await server();
