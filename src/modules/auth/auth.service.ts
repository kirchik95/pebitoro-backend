import { FastifyRequest } from 'fastify';
import { compare, hash } from 'bcrypt';
import { eq, getTableColumns } from 'drizzle-orm';
import { omit } from 'lodash-es';

import { users } from '@db/schema';

export const register = async (
  request: FastifyRequest,
  data: { email: string; password: string; firstName: string; lastName: string },
) => {
  const { db } = request.server;

  const hashedPassword = await hash(data.password, 10);

  const [user] = await db
    .insert(users)
    .values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    })
    .returning();

  const token = request.server.jwt.sign({
    id: user.id,
  });

  const result = { token, user: omit(user, ['password']) };

  return result;
};

export const login = async (request: FastifyRequest, data: { email: string; password: string }) => {
  const { db } = request.server;

  const [user] = await db
    .select({ ...getTableColumns(users) })
    .from(users)
    .where(eq(users.email, data.email));

  if (!user) {
    return null;
  }

  const isPasswordValid = await compare(data.password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  const token = request.server.jwt.sign({
    id: user.id,
  });

  return { token, user };
};
