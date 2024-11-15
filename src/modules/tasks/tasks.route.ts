import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import { createTaskHandler, getTaskByIdHandler, getTasksHandler } from './tasks.controller';
import { TaskSchema } from './tasks.schema';

const taskRoutes = (fastify: FastifyInstance) => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().route({
    method: 'GET',
    url: '/',
    handler: getTasksHandler,
  });

  fastify.get('/:id', {
    schema: {
      params: Type.Object({
        id: Type.Integer(),
      }),
      response: {
        200: TaskSchema,
        404: Type.Object({
          message: Type.String(),
        }),
      },
    },
    handler: getTaskByIdHandler,
  });

  fastify.post('/', {
    schema: {
      body: Type.Object({
        title: Type.String(),
        description: Type.String(),
        userId: Type.Integer(),
      }),
      response: {
        201: TaskSchema,
      },
    },
    handler: createTaskHandler,
  });
};

export default taskRoutes;
