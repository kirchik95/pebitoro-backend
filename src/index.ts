import Fastify from 'fastify';
import dotenv from 'dotenv';

import db from '@plugins/db';

import taskRoutes from '@modules/tasks/tasks.route';

dotenv.config();

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty' } } : false,
});

fastify.register(db);

fastify.register(taskRoutes, { prefix: '/api/tasks' });

const server = async () => {
  try {
    await fastify.listen({ port: Number(process.env.PORT) || 3000 });

    console.log(`Server is running on: ${(fastify.server.address() as { port: number }).port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

server();
