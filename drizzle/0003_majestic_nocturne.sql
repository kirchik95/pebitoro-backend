ALTER TABLE "categories" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "description" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "color" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "backgroundColor" SET DATA TYPE varchar(50);