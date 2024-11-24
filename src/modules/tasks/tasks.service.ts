import { FastifyRequest } from 'fastify';
import { and, eq } from 'drizzle-orm';

import { tasks } from '@db/schema';

export const getTasks = async (request: FastifyRequest) => {
  const { db } = request.server;

  return await db.select().from(tasks).where(eq(tasks.userId, request.user.id));
};

export const getTaskById = async (request: FastifyRequest, id: number) => {
  const { db } = request.server;

  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, request.user.id)));

  return task;
};

export const createTask = async (
  request: FastifyRequest,
  data: { title: string; description?: string },
) => {
  const { db } = request.server;

  const [task] = await db
    .insert(tasks)
    .values({ ...data, userId: request.user.id })
    .returning();

  return getTaskById(request, task.id);
};

export const updateTask = async (
  request: FastifyRequest,
  data: { id: number; title?: string; description?: string; status?: string },
) => {
  const { db } = request.server;

  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, data.id), eq(tasks.userId, request.user.id)));

  if (!task) {
    throw new Error('Task not found');
  }

  await db.update(tasks).set(data).where(eq(tasks.id, data.id));

  return getTaskById(request, data.id);
};

export const deleteTask = async (request: FastifyRequest, id: number) => {
  const { db } = request.server;

  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, request.user.id)));

  if (!task) {
    throw new Error('Task not found');
  }

  await db.delete(tasks).where(eq(tasks.id, id));
};
