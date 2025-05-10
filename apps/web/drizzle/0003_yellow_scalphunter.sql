CREATE TABLE "championships" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"competitionId" varchar(32) NOT NULL,
	"championshipType" varchar(50) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "championships" ADD CONSTRAINT "championships_competitionId_competitions_id_fk" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;