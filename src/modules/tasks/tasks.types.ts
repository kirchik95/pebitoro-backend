import { TaskSchema } from './tasks.schema';

export const StatusEnum = {
  Backlog: 'backlog',
  ToDo: 'todo',
  InProgress: 'in_progress',
  Done: 'done',
  Archived: 'archived',
} as const;

export const PriorityEnum = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

export type GetTasksParams = {
  search?: string;
  status?: Array<(typeof StatusEnum)[keyof typeof StatusEnum]>;
  priority?: Array<(typeof PriorityEnum)[keyof typeof PriorityEnum]>;
  categories?: number[];
};

export type Task = typeof TaskSchema;
