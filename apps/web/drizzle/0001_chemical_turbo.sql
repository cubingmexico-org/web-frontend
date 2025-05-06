ALTER TABLE "team_members" ADD COLUMN "isAdmin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "team_members" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "team_members" DROP COLUMN "isActive";