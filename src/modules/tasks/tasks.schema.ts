import { Type } from '@sinclair/typebox';

import { PriorityEnum, StatusEnum } from './tasks.types';

export const TaskSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  description: Type.String(),
  status: Type.Enum(StatusEnum),
  priority: Type.Enum(PriorityEnum),
  categories: Type.Optional(Type.Array(Type.Number())),
  startAt: Type.String(),
  finishAt: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});
