import { Type } from '@sinclair/typebox';

export const UserProfileSchema = Type.Object({
  id: Type.Number(),
  email: Type.String({ format: 'email' }),
  username: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  middleName: Type.String(),
  age: Type.Number(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});
