ALTER TABLE "kinchRanks" ADD CONSTRAINT "kinchRanks_personId_pk" PRIMARY KEY("personId");--> statement-breakpoint
ALTER TABLE "ranksAverage" ADD CONSTRAINT "ranksAverage_personId_eventId_pk" PRIMARY KEY("personId","eventId");--> statement-breakpoint
ALTER TABLE "ranksSingle" ADD CONSTRAINT "ranksSingle_personId_eventId_pk" PRIMARY KEY("personId","eventId");--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_competitionId_eventId_roundTypeId_pos_pk" PRIMARY KEY("competitionId","eventId","roundTypeId","pos");--> statement-breakpoint
ALTER TABLE "sumOfRanks" ADD CONSTRAINT "sumOfRanks_personId_resultType_pk" PRIMARY KEY("personId","resultType");