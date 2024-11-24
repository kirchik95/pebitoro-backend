import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  getTasksHandler,
  updateTaskHandler,
} from './tasks.controller';
import { TaskSchema } from './tasks.schema';

const taskRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', {
    preValidation: [fastify.authenticate],
    schema: {
      response: {
        200: Type.Array(TaskSchema),
      },
    },
    handler: getTasksHandler,
  });
  fastify.get('/:id', {
    preValidation: [fastify.authenticate],
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
    preValidation: [fastify.authenticate],
    schema: {
      body: Type.Object({
        title: Type.String(),
        description: Type.Optional(Type.String()),
      }),
      response: {
        201: TaskSchema,
      },
    },
    handler: createTaskHandler,
  });
  fastify.delete('/:id', {
    preValidation: [fastify.authenticate],
    schema: {
      params: Type.Object({
        id: Type.Integer(),
      }),
      response: {
        200: Type.Object({
          message: Type.String(),
        }),
      },
    },
    handler: deleteTaskHandler,
  });
  fastify.put('/:id', {
    preValidation: [fastify.authenticate],
    schema: {
      params: Type.Object({
        id: Type.Integer(),
      }),
      body: Type.Object({
        title: Type.Optional(Type.String()),
        description: Type.Optional(Type.String()),
        status: Type.Optional(Type.String()),
      }),
      response: {
        200: TaskSchema,
      },
    },
    handler: updateTaskHandler,
  });
};

export default taskRoutes;
