import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { taskCategories } from './tasks';
import { users } from './users';

export const categories = pgTable('categories', {
  id: serial().primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: varchar({ length: 255 }).notNull(),
  description: text(''),
  color: varchar({ length: 50 }).default(''),
  backgroundColor: varchar({ length: 50 }).default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categoryRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  tasks: many(taskCategories),
}));
