CREATE TABLE "competitions" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"cityName" varchar(50) NOT NULL,
	"countryId" varchar(50) NOT NULL,
	"information" text,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"cancelled" integer DEFAULT 0 NOT NULL,
	"venue" varchar(240) NOT NULL,
	"venueAddress" varchar(191),
	"venueDetails" varchar(191),
	"external_website" varchar(200),
	"cellName" varchar(45) NOT NULL,
	"latitude" integer,
	"longitude" integer,
	"stateId" varchar(3)
);
--> statement-breakpoint
CREATE TABLE "competition_delegates" (
	"competitionId" varchar(32) NOT NULL,
	"delegateId" varchar(128) NOT NULL,
	CONSTRAINT "competition_delegates_competitionId_delegateId_pk" PRIMARY KEY("competitionId","delegateId")
);
--> statement-breakpoint
CREATE TABLE "competition_events" (
	"competitionId" varchar(32) NOT NULL,
	"eventId" varchar(6) NOT NULL,
	CONSTRAINT "competition_events_competitionId_eventId_pk" PRIMARY KEY("competitionId","eventId")
);
--> statement-breakpoint
CREATE TABLE "competition_organisers" (
	"competitionId" varchar(32) NOT NULL,
	"organiserId" varchar(128) NOT NULL,
	CONSTRAINT "competition_organisers_competitionId_organiserId_pk" PRIMARY KEY("competitionId","organiserId")
);
--> statement-breakpoint
CREATE TABLE "delegates" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"personId" varchar(10) NOT NULL,
	"status" varchar(50) DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar(6) PRIMARY KEY NOT NULL,
	"name" varchar(54) NOT NULL,
	"rank" integer DEFAULT 0 NOT NULL,
	"format" varchar(10) NOT NULL,
	"cellName" varchar(45) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exportMetadata" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kinchRanks" (
	"rank" integer NOT NULL,
	"personId" varchar(10) NOT NULL,
	"overall" double precision NOT NULL,
	"events" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organisers" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"personId" varchar(10),
	"status" varchar(50) DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "persons" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"name" varchar(80),
	"gender" varchar(1),
	"stateId" varchar(3)
);
--> statement-breakpoint
CREATE TABLE "ranksAverage" (
	"personId" varchar(10) NOT NULL,
	"eventId" varchar(6) NOT NULL,
	"best" integer DEFAULT 0 NOT NULL,
	"worldRank" integer DEFAULT 0 NOT NULL,
	"continentRank" integer DEFAULT 0 NOT NULL,
	"countryRank" integer DEFAULT 0 NOT NULL,
	"stateRank" integer
);
--> statement-breakpoint
CREATE TABLE "ranksSingle" (
	"personId" varchar(10) NOT NULL,
	"eventId" varchar(6) NOT NULL,
	"best" integer DEFAULT 0 NOT NULL,
	"worldRank" integer DEFAULT 0 NOT NULL,
	"continentRank" integer DEFAULT 0 NOT NULL,
	"countryRank" integer DEFAULT 0 NOT NULL,
	"stateRank" integer
);
--> statement-breakpoint
CREATE TABLE "results" (
	"competitionId" varchar(32) NOT NULL,
	"eventId" varchar(6) NOT NULL,
	"roundTypeId" varchar(1),
	"pos" smallint DEFAULT 0,
	"best" integer DEFAULT 0 NOT NULL,
	"average" integer DEFAULT 0 NOT NULL,
	"personId" varchar(10) NOT NULL,
	"formatId" varchar(1) NOT NULL,
	"value1" integer DEFAULT 0 NOT NULL,
	"value2" integer DEFAULT 0 NOT NULL,
	"value3" integer DEFAULT 0 NOT NULL,
	"value4" integer DEFAULT 0 NOT NULL,
	"value5" integer DEFAULT 0 NOT NULL,
	"regionalSingleRecord" varchar(3),
	"regionalAverageRecord" varchar(3)
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" varchar(3) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"logo" varchar(191),
	"facebook" varchar(191),
	"instagram" varchar(191),
	"tiktok" varchar(191),
	"phoneNumber" varchar(15),
	"email" varchar(191),
	"active" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "states" (
	"id" varchar(3) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sumOfRanks" (
	"rank" integer NOT NULL,
	"personId" varchar(10) NOT NULL,
	"resultType" varchar(7) NOT NULL,
	"overall" integer NOT NULL,
	"events" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"name" varchar(50) NOT NULL,
	"description" text,
	"image" varchar(191),
	"coverImage" varchar(191),
	"stateId" varchar(3) PRIMARY KEY NOT NULL,
	"founded" timestamp,
	"socialLinks" json,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_achievements" (
	"stateId" varchar(3) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"personId" varchar(10) PRIMARY KEY NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"specialties" json,
	"achievements" json,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_stateId_states_id_fk" FOREIGN KEY ("stateId") REFERENCES "public"."states"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_delegates" ADD CONSTRAINT "competition_delegates_competitionId_competitions_id_fk" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_delegates" ADD CONSTRAINT "competition_delegates_delegateId_delegates_id_fk" FOREIGN KEY ("delegateId") REFERENCES "public"."delegates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_events" ADD CONSTRAINT "competition_events_competitionId_competitions_id_fk" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_events" ADD CONSTRAINT "competition_events_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_organisers" ADD CONSTRAINT "competition_organisers_competitionId_competitions_id_fk" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competition_organisers" ADD CONSTRAINT "competition_organisers_organiserId_organisers_id_fk" FOREIGN KEY ("organiserId") REFERENCES "public"."organisers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delegates" ADD CONSTRAINT "delegates_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kinchRanks" ADD CONSTRAINT "kinchRanks_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisers" ADD CONSTRAINT "organisers_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "persons" ADD CONSTRAINT "persons_stateId_states_id_fk" FOREIGN KEY ("stateId") REFERENCES "public"."states"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranksAverage" ADD CONSTRAINT "ranksAverage_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranksAverage" ADD CONSTRAINT "ranksAverage_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranksSingle" ADD CONSTRAINT "ranksSingle_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ranksSingle" ADD CONSTRAINT "ranksSingle_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_competitionId_competitions_id_fk" FOREIGN KEY ("competitionId") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sumOfRanks" ADD CONSTRAINT "sumOfRanks_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_stateId_states_id_fk" FOREIGN KEY ("stateId") REFERENCES "public"."states"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_achievements" ADD CONSTRAINT "team_achievements_stateId_states_id_fk" FOREIGN KEY ("stateId") REFERENCES "public"."states"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_personId_persons_id_fk" FOREIGN KEY ("personId") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;