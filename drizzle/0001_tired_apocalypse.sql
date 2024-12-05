ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'backlog';--> statement-breakpoint
ALTER TABLE "public"."tasks" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('backlog', 'todo', 'in_progress', 'done', 'archived');--> statement-breakpoint
ALTER TABLE "public"."tasks" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";
