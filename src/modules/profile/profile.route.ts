import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

import { getProfileHandler, updateProfileHandler } from './profile.controller';
import { UserProfileSchema } from './profile.schema';

const profileRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', {
    preValidation: [fastify.authenticate],
    schema: {
      response: {
        200: UserProfileSchema,
      },
    },
    handler: getProfileHandler,
  });
  fastify.put('/', {
    preValidation: [fastify.authenticate],
    schema: {
      body: Type.Partial(
        Type.Object(
          {
            email: UserProfileSchema.properties.email,
            username: UserProfileSchema.properties.username,
            firstName: UserProfileSchema.properties.firstName,
            lastName: UserProfileSchema.properties.lastName,
            middleName: UserProfileSchema.properties.middleName,
            age: UserProfileSchema.properties.age,
          },
          { additionalProperties: false },
        ),
      ),
      response: {
        200: UserProfileSchema,
      },
    },
    handler: updateProfileHandler,
  });
};

export default profileRoutes;
