CREATE TABLE "sponsoredCompetitionScores" (
	"sponsoredTeamMemberId" varchar(32) NOT NULL,
	"competitionId" varchar(32) NOT NULL,
	"score" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsoredTeamMembers" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"sponsoredTeamId" varchar(32) NOT NULL,
	"personId" varchar(10) NOT NULL
);
--> statement-breakpoint
DROP TABLE "team_member_scores" CASCADE;--> statement-breakpoint
ALTER TABLE "sponsoredCompetitionScores" ADD CONSTRAINT "sponsoredCompetitionScores_sponsoredTeamMemberId_sponsoredTeamMembers_id_fk" FOREIGN KEY ("sponsoredTeamMemberId") REFERENCES "public"."sponsoredTeamMembers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsoredCompetitionScores" ADD CONSTRAINT "sponsoredCompetitionScores_competitionId_competitions_id_fk" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsoredTeamMembers" ADD CONSTRAINT "sponsoredTeamMembers_sponsoredTeamId_sponsoredTeams_id_fk" FOREIGN KEY ("sponsoredTeamId") REFERENCES "public"."sponsoredTeams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsoredTeamMembers" ADD CONSTRAINT "sponsoredTeamMembers_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;