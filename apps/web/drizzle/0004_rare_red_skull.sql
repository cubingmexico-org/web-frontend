CREATE TABLE "sponsoredTeams" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"sponsorId" varchar(32) NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_member_scores" (
	"sponsoredTeamId" varchar(32) NOT NULL,
	"personId" varchar(10) NOT NULL,
	"competitionId" varchar(32) NOT NULL,
	"score" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sponsors" ALTER COLUMN "id" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "sponsors" DROP COLUMN "active";--> statement-breakpoint
ALTER TABLE "sponsors" ADD COLUMN "active" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sponsors" ADD COLUMN "socialLinks" jsonb;--> statement-breakpoint
ALTER TABLE "sponsors" ADD COLUMN "inCup" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sponsoredTeams" ADD CONSTRAINT "sponsoredTeams_sponsorId_sponsors_id_fk" FOREIGN KEY ("sponsorId") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member_scores" ADD CONSTRAINT "team_member_scores_sponsoredTeamId_sponsoredTeams_id_fk" FOREIGN KEY ("sponsoredTeamId") REFERENCES "public"."sponsoredTeams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member_scores" ADD CONSTRAINT "team_member_scores_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member_scores" ADD CONSTRAINT "team_member_scores_competitionId_competitions_id_fk" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" DROP COLUMN "instagram";--> statement-breakpoint
ALTER TABLE "sponsors" DROP COLUMN "tiktok";--> statement-breakpoint
ALTER TABLE "sponsors" DROP COLUMN "phoneNumber";--> statement-breakpoint
ALTER TABLE "sponsors" DROP COLUMN "email";