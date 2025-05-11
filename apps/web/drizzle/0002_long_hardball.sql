ALTER TABLE "kinchRanks" ALTER COLUMN "events" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "sumOfRanks" ALTER COLUMN "events" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "socialLinks" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "specialties" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "achievements" SET DATA TYPE jsonb;