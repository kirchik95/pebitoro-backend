import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
} from './categories.controller';
import { CategorySchema } from './categories.schema';

const categoriesRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', {
    preValidation: [fastify.authenticate],
    schema: {
      response: {
        200: Type.Array(CategorySchema),
      },
    },
    handler: getCategoriesHandler,
  });
  fastify.get('/:id', {
    preValidation: [fastify.authenticate],
    schema: {
      params: Type.Object({
        id: Type.Integer(),
      }),
      response: {
        200: CategorySchema,
        404: Type.Object({
          message: Type.String(),
        }),
      },
    },
    handler: getCategoryByIdHandler,
  });
  fastify.post('/', {
    preValidation: [fastify.authenticate],
    schema: {
      body: Type.Object({
        name: CategorySchema.properties.name,
        description: Type.Optional(CategorySchema.properties.description),
      }),
      response: {
        201: CategorySchema,
      },
    },
    handler: createCategoryHandler,
  });
  fastify.put('/:id', {
    preValidation: [fastify.authenticate],
    schema: {
      params: Type.Object({
        id: Type.Integer(),
      }),
      body: Type.Object({
        name: Type.Optional(CategorySchema.properties.name),
        description: Type.Optional(CategorySchema.properties.description),
      }),
      response: {
        200: CategorySchema,
        404: Type.Object({
          message: Type.String(),
        }),
      },
    },
    handler: updateCategoryHandler,
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
        404: Type.Object({
          message: Type.String(),
        }),
      },
    },
    handler: deleteCategoryHandler,
  });
};

export default categoriesRoutes;
