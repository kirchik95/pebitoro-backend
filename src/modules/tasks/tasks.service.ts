import { FastifyRequest } from 'fastify';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';

import { taskCategories, tasks } from '@db/schema';

import { Task } from './tasks.types';

export const getTasks = async (request: FastifyRequest) => {
  const { db } = request.server;

  return await db
    .select({
      ...getTableColumns(tasks),
      categories: sql<number[]>`
        array_agg(${taskCategories.categoryId}) filter (where ${taskCategories.categoryId} is not null)
      `,
    })
    .from(tasks)
    .leftJoin(taskCategories, eq(tasks.id, taskCategories.taskId))
    .where(eq(tasks.userId, request.user.id))
    .groupBy(tasks.id)
    .orderBy(desc(tasks.createdAt));
};

export const getTaskById = async (request: FastifyRequest, id: number) => {
  const { db } = request.server;

  const [task] = await db
    .select({
      ...getTableColumns(tasks),
      categories: sql<number[]>`
        array_agg(${taskCategories.categoryId}) filter (where ${taskCategories.categoryId} is not null)
      `,
    })
    .from(tasks)
    .leftJoin(taskCategories, eq(tasks.id, taskCategories.taskId))
    .where(and(eq(tasks.id, id), eq(tasks.userId, request.user.id)))
    .groupBy(tasks.id);

  return task;
};

export const createTask = async (
  request: FastifyRequest,
  data: { title: string; categories?: number[] } & Partial<Omit<Task, 'id'>>,
) => {
  const { db } = request.server;

  return await db.transaction(async (tx) => {
    const [task] = await tx
      .insert(tasks)
      .values({ ...data, userId: request.user.id })
      .returning({
        ...getTableColumns(tasks),
        categories: sql<number[]>`ARRAY[]::integer[]`,
      });

    if (data.categories?.length) {
      await tx.insert(taskCategories).values(
        data.categories.map((categoryId) => ({
          taskId: task.id,
          categoryId,
        })),
      );

      const [taskWithCategories] = await tx
        .select({
          ...getTableColumns(tasks),
          categories: sql<number[]>`(
           SELECT array_agg(category_id)
           FROM ${taskCategories}
           WHERE task_id = ${task.id}
         )`,
        })
        .from(tasks)
        .where(eq(tasks.id, task.id));

      return taskWithCategories;
    }

    return task;
  });
};

export const updateTask = async (
  request: FastifyRequest,
  data: { id: number; categories?: number[] } & Partial<Task>,
) => {
  const { db } = request.server;

  return await db.transaction(async (tx) => {
    const task = await getTaskById(request, data.id);

    if (!task) {
      throw new Error('Task not found');
    }

    const taskData = { ...data };
    delete taskData.categories;

    if (data.categories) {
      await tx.delete(taskCategories).where(eq(taskCategories.taskId, data.id));

      if (data.categories?.length) {
        await tx
          .insert(taskCategories)
          .values(data.categories.map((categoryId) => ({ taskId: data.id, categoryId })));
      }
    }

    const [updatedTask] = await tx
      .update(tasks)
      .set({ ...taskData, updatedAt: new Date() })
      .where(eq(tasks.id, data.id))
      .returning({
        ...getTableColumns(tasks),
        categories: sql<number[]>`(
          SELECT array_agg(category_id) 
          FROM ${taskCategories} 
          WHERE task_id = ${data.id}
        )`,
      });

    return updatedTask;
  });
};

export const deleteTask = async (request: FastifyRequest, id: number) => {
  const { db } = request.server;

  return await db.transaction(async (tx) => {
    const task = await getTaskById(request, id);

    if (!task) {
      throw new Error('Task not found');
    }

    await tx.delete(taskCategories).where(eq(taskCategories.taskId, id));
    await tx.delete(tasks).where(eq(tasks.id, id));
  });
};
