import { FastifyReply, FastifyRequest } from 'fastify';

import * as profileService from './profile.service';
import { UserProfile } from './profile.types';

export const getProfileHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await profileService.getProfile(request);

  reply.send(user);
};

export const updateProfileHandler = async (
  request: FastifyRequest<{ Body: UserProfile }>,
  reply: FastifyReply,
) => {
  const user = await profileService.updateProfile(request, request.body);

  reply.send(user);
};
