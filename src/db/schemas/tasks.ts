import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { categories } from './categories';
import { users } from './users';

export const taskCategories = pgTable('task_categories', {
  taskId: integer('task_id').references(() => tasks.id),
  categoryId: integer('category_id').references(() => categories.id),
});

export const taskCategoriesRelations = relations(taskCategories, ({ one }) => ({
  task: one(tasks, {
    fields: [taskCategories.taskId],
    references: [tasks.id],
  }),
  category: one(categories, {
    fields: [taskCategories.categoryId],
    references: [categories.id],
  }),
}));

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

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  categories: many(taskCategories),
}));
