import { TaskSchema } from './tasks.schema';

export const StatusEnum = {
  Created: 'created',
  InProgress: 'in_progress',
  Done: 'done',
  Archived: 'archived',
} as const;

export const PriorityEnum = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

export type Task = typeof TaskSchema;
