import { FastifyReply, FastifyRequest } from 'fastify';

import * as categoriesService from './categories.service';
import type { Category } from './categories.types';

export const getCategoriesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const categories = await categoriesService.getCategories(request);

  reply.send(categories);
};

export const getCategoryByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const category = await categoriesService.getCategoryById(request, Number(request.params.id));

  if (!category) {
    reply.code(404).send({ message: 'Category not found' });
  }

  reply.send(category);
};

export const createCategoryHandler = async (
  request: FastifyRequest<{ Body: Pick<Category, 'name' | 'description'> }>,
  reply: FastifyReply,
) => {
  const category = await categoriesService.createCategory(request, request.body);

  reply.code(201).send(category);
};

export const updateCategoryHandler = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<Omit<Category, 'id'>>;
  }>,
  reply: FastifyReply,
) => {
  const category = await categoriesService.updateCategory(request, {
    ...request.body,
    id: Number(request.params.id),
  });

  reply.send(category);
};

export const deleteCategoryHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  await categoriesService.deleteCategory(request, Number(request.params.id));

  reply.send({ message: `Category ${request.params.id} deleted` });
};
