import { FastifyRequest } from 'fastify';
import { and, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import { intersection, map, values } from 'lodash-es';

import { taskCategories, tasks } from '@db/schema';

import { GetTasksParams, PriorityEnum, StatusEnum, Task } from './tasks.types';

export const getTasks = async (request: FastifyRequest, params: GetTasksParams) => {
  const { db } = request.server;
  const { search, status, priority, categories } = params;

  const whereConditions = [
    eq(tasks.userId, request.user.id),
    search
      ? or(ilike(tasks.title, `%${search}%`), ilike(tasks.description, `%${search}%`))
      : undefined,
    priority?.length ? inArray(tasks.priority, priority) : undefined,
    status?.length ? inArray(tasks.status, status) : undefined,
  ].filter(Boolean);

  const items = await db.query.tasks.findMany({
    where: and(...whereConditions),
    with: { categories: { with: { category: { columns: { id: true } } } } },
    orderBy: desc(tasks.createdAt),
  });

  const categoryIds = categories
    ? (Array.isArray(categories) ? categories : [categories]).map(Number)
    : [];

  const filteredItems = categoryIds.length
    ? items.filter((item) => intersection(map(item.categories, 'category.id'), categoryIds).length)
    : items;

  return filteredItems.map((item) => ({
    ...item,
    categories: map(item.categories, 'category.id'),
  }));
};

export const getTaskById = async (request: FastifyRequest, id: number) => {
  const { db } = request.server;

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, id), eq(tasks.userId, request.user.id)),
    with: { categories: { with: { category: { columns: { id: true } } } } },
  });

  if (!task) {
    return null;
  }

  return { ...task, categories: map(task.categories, 'category.id') };
};

export const getTasksCount = async (
  request: FastifyRequest,
  params: { countBy: 'status' | 'priority' | 'category' },
) => {
  const { db } = request.server;
  const { countBy } = params;

  if (countBy === 'category') {
    const result = await db
      .select({
        categoryId: taskCategories.categoryId,
        count: sql<number>`count(distinct ${tasks.id})::int`.as('count'),
      })
      .from(taskCategories)
      .leftJoin(tasks, eq(tasks.id, taskCategories.taskId))
      .where(eq(tasks.userId, request.user.id))
      .groupBy(taskCategories.categoryId);

    return Object.fromEntries(result.map(({ categoryId, count }) => [categoryId, count])) as Record<
      number,
      number
    >;
  }

  const enumMap = {
    status: {
      enum: StatusEnum,
      column: tasks.status,
    },
    priority: {
      enum: PriorityEnum,
      column: tasks.priority,
    },
  }[countBy];

  const items = values(enumMap.enum);

  const counts = await Promise.all(
    map(items, async (item) => {
      const count = await db.$count(
        tasks,
        and(eq(tasks.userId, request.user.id), eq(enumMap.column, item)),
      );
      return [item, count] as const;
    }),
  );

  return Object.fromEntries(counts);
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
      .returning();

    if (data.categories?.length) {
      await tx
        .insert(taskCategories)
        .values(map(data.categories, (categoryId) => ({ taskId: task.id, categoryId })));
    }

    const taskWithCategories = await tx.query.tasks.findFirst({
      where: eq(tasks.id, task.id),
      with: { categories: { with: { category: { columns: { id: true } } } } },
    });

    return {
      ...taskWithCategories,
      categories: map(taskWithCategories?.categories, 'category.id'),
    };
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

    await tx
      .update(tasks)
      .set({ ...taskData, updatedAt: new Date() })
      .where(eq(tasks.id, data.id));

    const updatedTask = await tx.query.tasks.findFirst({
      where: eq(tasks.id, data.id),
      with: { categories: { with: { category: { columns: { id: true } } } } },
    });

    return {
      ...updatedTask,
      categories: map(updatedTask?.categories, 'category.id'),
    };
  });
};

export const deleteTask = async (request: FastifyRequest, id: number) => {
  const { db } = request.server;

  return await db.transaction(async (tx) => {
    const task = await tx.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, request.user.id)),
    });

    if (!task) {
      throw new Error('Task not found');
    }

    await tx.delete(taskCategories).where(eq(taskCategories.taskId, id));
    await tx.delete(tasks).where(eq(tasks.id, id));
  });
};
