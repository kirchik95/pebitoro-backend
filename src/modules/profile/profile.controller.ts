import { FastifyReply, FastifyRequest } from 'fastify';

import * as profileService from './profile.service';

export const getProfileHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await profileService.getProfile(request);

  reply.send(user);
};
