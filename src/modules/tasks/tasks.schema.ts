import { Type } from '@sinclair/typebox';

export const TaskSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  description: Type.String(),
  status: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});
