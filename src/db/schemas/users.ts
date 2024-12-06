import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { categories } from './categories';
import { tasks } from './tasks';

export const users = pgTable('users', {
  id: serial().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).default(''),
  firstName: varchar({ length: 255 }).default(''),
  middleName: varchar({ length: 255 }).default(''),
  lastName: varchar({ length: 255 }).default(''),
  age: integer().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  categories: many(categories),
}));
