import { FastifyRequest } from 'fastify';
import { and, eq } from 'drizzle-orm';

import { categories } from '@db/schema';

import type { Category } from './categories.types';

export const getCategories = async (request: FastifyRequest) => {
  const { db } = request.server;

  return await db
    .select()
    .from(categories)
    .where(eq(categories.userId, request.user.id))
    .orderBy(categories.createdAt);
};

export const getCategoryById = async (request: FastifyRequest, id: number) => {
  const { db } = request.server;

  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, request.user.id)));

  return category;
};

export const createCategory = async (
  request: FastifyRequest,
  data: Pick<Category, 'name' | 'description'>,
) => {
  const { db } = request.server;

  const [category] = await db
    .insert(categories)
    .values({ ...data, userId: request.user.id })
    .returning();

  return getCategoryById(request, category.id);
};

export const updateCategory = async (
  request: FastifyRequest,
  data: { id: number } & Partial<Omit<Category, 'id'>>,
) => {
  const { db } = request.server;

  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, data.id), eq(categories.userId, request.user.id)));

  if (!category) {
    throw new Error('Category not found');
  }

  const [updatedCategory] = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, data.id))
    .returning();

  return updatedCategory;
};

export const deleteCategory = async (request: FastifyRequest, id: number) => {
  const { db } = request.server;

  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, request.user.id)));

  if (!category) {
    throw new Error('Category not found');
  }

  await db.delete(categories).where(eq(categories.id, id));
};
