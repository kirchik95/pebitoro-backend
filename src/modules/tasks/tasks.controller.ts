import { FastifyReply, FastifyRequest } from 'fastify';

import * as tasksService from './tasks.service';

export const getTasksHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const tasks = await tasksService.getTasks(request);

  console.log('tasks', tasks);

  reply.send(tasks);
};

export const getTaskByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const task = await tasksService.getTaskById(request, request.params.id);

  if (!task) {
    reply.code(404).send({ message: 'Task not found' });
  }

  reply.send(task);
};

export const createTaskHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const task = await tasksService.createTask(request, request.body);

  reply.code(201).send(task);
};
