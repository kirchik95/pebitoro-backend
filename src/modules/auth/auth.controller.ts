import { FastifyReply, FastifyRequest } from 'fastify';

import * as authService from './auth.service';

export const registerHandler = async (
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply,
) => {
  const user = await authService.register(request, request.body);

  reply.code(201).send(user);
};

export const loginHandler = async (
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply,
) => {
  const user = await authService.login(request, request.body);

  if (!user) {
    reply.code(401).send({ message: 'Invalid email or password' });

    return;
  }

  reply.send(user);
};
