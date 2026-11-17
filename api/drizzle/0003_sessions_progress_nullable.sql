ALTER TABLE "sessions" ALTER COLUMN "progress" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "progress" DROP NOT NULL;
