import { Type } from '@sinclair/typebox';

import { PriorityEnum, StatusEnum } from './tasks.types';

export const TaskSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  description: Type.String(),
  categoryId: Type.Union([(Type.Number(), Type.Null())]),
  status: Type.Enum(StatusEnum),
  priority: Type.Enum(PriorityEnum),
  startAt: Type.String(),
  finishAt: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});
