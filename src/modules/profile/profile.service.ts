import { FastifyRequest } from 'fastify';
import { eq } from 'drizzle-orm';

import { users } from '@db/schema';

import { UserProfile } from './profile.types';

export const getProfile = async (request: FastifyRequest) => {
  const { db } = request.server;

  const [user] = await db.select().from(users).where(eq(users.id, request.user.id));

  return user;
};

export const updateProfile = async (request: FastifyRequest, data: UserProfile) => {
  const { db } = request.server;

  const [user] = await db.select().from(users).where(eq(users.id, request.user.id));

  if (!user) {
    throw new Error('User not found');
  }

  const [updatedTask] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, request.user.id))
    .returning();

  return updatedTask;
};
