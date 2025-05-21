ALTER TABLE "sponsoredCompetitionScores" RENAME TO "sponsored_competition_scores";--> statement-breakpoint
ALTER TABLE "sponsoredTeamMembers" RENAME TO "sponsored_team_members";--> statement-breakpoint
ALTER TABLE "sponsored_competition_scores" DROP CONSTRAINT "sponsoredCompetitionScores_sponsoredTeamMemberId_sponsoredTeamMembers_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsored_competition_scores" DROP CONSTRAINT "sponsoredCompetitionScores_competitionId_competitions_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsored_team_members" DROP CONSTRAINT "sponsoredTeamMembers_sponsoredTeamId_sponsoredTeams_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsored_team_members" DROP CONSTRAINT "sponsoredTeamMembers_personId_persons_id_fk";
--> statement-breakpoint
ALTER TABLE "sponsored_competition_scores" ADD CONSTRAINT "sponsored_competition_scores_sponsoredTeamMemberId_sponsored_team_members_id_fk" FOREIGN KEY ("sponsoredTeamMemberId") REFERENCES "public"."sponsored_team_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsored_competition_scores" ADD CONSTRAINT "sponsored_competition_scores_competitionId_competitions_id_fk" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsored_team_members" ADD CONSTRAINT "sponsored_team_members_sponsoredTeamId_sponsoredTeams_id_fk" FOREIGN KEY ("sponsoredTeamId") REFERENCES "public"."sponsoredTeams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsored_team_members" ADD CONSTRAINT "sponsored_team_members_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;