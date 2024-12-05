import { integer, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

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

export const categories = pgTable('categories', {
  id: serial().primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).default(''),
  color: varchar({ length: 255 }).default(''),
  backgroundColor: varchar({ length: 255 }).default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const taskCategories = pgTable('task_categories', {
  taskId: integer('task_id').references(() => tasks.id),
  categoryId: integer('category_id').references(() => categories.id),
});

export const statusEnum = pgEnum('status', ['backlog', 'todo', 'in_progress', 'done', 'archived']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);

export const tasks = pgTable('tasks', {
  id: serial().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).default(''),
  userId: integer('user_id').references(() => users.id),
  status: statusEnum().default('backlog'),
  priority: priorityEnum().default('low'),
  startAt: timestamp('start_at').defaultNow(),
  finishAt: timestamp('finish_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
