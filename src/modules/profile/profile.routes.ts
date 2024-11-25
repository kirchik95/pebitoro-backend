import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

import { getProfileHandler } from './profile.controller';

const profileRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', {
    preValidation: [fastify.authenticate],
    schema: {
      response: {
        200: Type.Object({
          id: Type.Number(),
          email: Type.String(),
          firstName: Type.String(),
          lastName: Type.String(),
          middleName: Type.String(),
        }),
      },
    },
    handler: getProfileHandler,
  });
};

export default profileRoutes;
