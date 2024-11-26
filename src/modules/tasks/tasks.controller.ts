import { FastifyReply, FastifyRequest } from 'fastify';

import * as tasksService from './tasks.service';
import { Task } from './tasks.types';

export const getTasksHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const tasks = await tasksService.getTasks(request);

  reply.send(tasks);
};

export const getTaskByIdHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const task = await tasksService.getTaskById(request, Number(request.params.id));

  if (!task) {
    reply.code(404).send({ message: 'Task not found' });
  }

  reply.send(task);
};

export const createTaskHandler = async (
  request: FastifyRequest<{ Body: { title: string } & Partial<Omit<Task, 'id'>> }>,
  reply: FastifyReply,
) => {
  const task = await tasksService.createTask(request, request.body);

  reply.code(201).send(task);
};

export const updateTaskHandler = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<Omit<Task, 'id'>>;
  }>,
  reply: FastifyReply,
) => {
  const task = await tasksService.updateTask(request, {
    ...request.body,
    id: Number(request.params.id),
  });

  reply.send(task);
};

export const deleteTaskHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  await tasksService.deleteTask(request, Number(request.params.id));

  reply.send({ message: `Task ${request.params.id} deleted` });
};
