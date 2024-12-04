import { Type } from '@sinclair/typebox';

export const CategorySchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  description: Type.String(),
  color: Type.String(),
  backgroundColor: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});
