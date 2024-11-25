import { FastifyRequest } from 'fastify';
import { eq } from 'drizzle-orm';

import { users } from '@db/schema';

export const getProfile = async (request: FastifyRequest) => {
  const { db } = request.server;

  const [user] = await db.select().from(users).where(eq(users.id, request.user.id));

  return user;
};
