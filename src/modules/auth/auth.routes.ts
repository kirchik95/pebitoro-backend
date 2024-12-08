import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

import { loginHandler, registerHandler } from './auth.controller';

const authRoutes = (fastify: FastifyInstance) => {
  fastify.post('/register', {
    schema: {
      body: Type.Object({
        email: Type.String({ format: 'email' }),
        password: Type.String(),
        firstName: Type.String(),
        lastName: Type.String(),
      }),
    },
    handler: registerHandler,
  });
  fastify.post('/login', {
    schema: {
      body: Type.Object({
        email: Type.String({ format: 'email' }),
        password: Type.String(),
      }),
      response: {
        200: Type.Object({
          token: Type.String(),
          user: Type.Object({
            id: Type.String(),
            email: Type.String(),
            firstName: Type.String(),
            lastName: Type.String(),
            middleName: Type.String(),
          }),
        }),
      },
    },
    handler: loginHandler,
  });
};

export default authRoutes;
