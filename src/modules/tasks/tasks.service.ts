import { FastifyRequest } from 'fastify';
import { eq } from 'drizzle-orm';

import { tasks } from '@db/schema';

export const getTasks = async (request: FastifyRequest) => {
  const { db } = request.server;

  return await db.select().from(tasks);
};

export const getTaskById = async (request: FastifyRequest, id: number) => {
  const { db } = request.server;

  const [task] = await db.select().from(tasks).where(eq(tasks.id, id));

  return task;
};

export const createTask = async (request: FastifyRequest, data: { title: string; description?: string }) => {
  const { db } = request.server;

  const [task] = await db
    .insert(tasks)
    .values({
      title: data.title,
      description: data.description,
    })
    .returning();

  return getTaskById(request, task.id);
};
