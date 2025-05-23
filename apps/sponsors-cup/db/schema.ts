import { type InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  smallint,
  integer,
  primaryKey,
  timestamp,
  doublePrecision,
  boolean,
  jsonb,
  real,
} from "drizzle-orm/pg-core";

// WCA

export const competition = pgTable("competitions", {
  id: varchar("id", { length: 32 }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  cityName: varchar("cityName", { length: 50 }).notNull(),
  countryId: varchar("countryId", { length: 50 }).notNull(),
  information: text("information"),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  cancelled: integer("cancelled").notNull().default(0),
  // eventSpecs: text("eventSpecs"),
  // wcaDelegate: text("wcaDelegate"),
  // organiser: text("organiser"),
  venue: varchar("venue", { length: 240 }).notNull(),
  venueAddress: varchar("venueAddress", { length: 191 }),
  venueDetails: varchar("venueDetails", { length: 191 }),
  external_website: varchar("external_website", { length: 200 }),
  cellName: varchar("cellName", { length: 45 }).notNull(),
  latitude: integer("latitude"),
  longitude: integer("longitude"),
  // Cubing México
  stateId: varchar("stateId", { length: 3 }).references(() => state.id, {
    onDelete: "cascade",
  }),
});

export type Competition = InferSelectModel<typeof competition>;

export const championship = pgTable("championships", {
  id: varchar("id", { length: 32 }).primaryKey(),
  competitionId: varchar("competitionId", { length: 32 })
    .references(() => competition.id, { onDelete: "cascade" })
    .notNull(),
  championshipType: varchar("championshipType", {
    length: 50,
  }).notNull(),
});

export type Championship = InferSelectModel<typeof championship>;

export const event = pgTable("events", {
  id: varchar("id", { length: 6 }).primaryKey(),
  name: varchar("name", { length: 54 }).notNull(),
  rank: integer("rank").notNull().default(0),
  format: varchar("format", { length: 10 }).notNull(),
  cellName: varchar("cellName", { length: 45 }).notNull(),
});

export type Event = InferSelectModel<typeof event>;

export const competitionEvent = pgTable(
  "competition_events",
  {
    competitionId: varchar("competitionId", { length: 32 })
      .references(() => competition.id, { onDelete: "cascade" })
      .notNull(),
    eventId: varchar("eventId", { length: 6 })
      .references(() => event.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.competitionId, t.eventId] })],
);

export type CompetitionEvent = InferSelectModel<typeof competitionEvent>;

export const person = pgTable("persons", {
  id: varchar("id", { length: 10 }).primaryKey(),
  name: varchar("name", { length: 80 }),
  gender: varchar("gender", { length: 1, enum: ["m", "f", "o"] }),
  // Cubing México
  stateId: varchar("stateId", { length: 3 }).references(() => state.id, {
    onDelete: "cascade",
  }),
});

export type Person = InferSelectModel<typeof person>;

export const organiser = pgTable("organisers", {
  id: varchar("id", { length: 128 }).primaryKey(),
  personId: varchar("personId", { length: 10 }).references(() => person.id, {
    onDelete: "cascade",
  }),
  status: varchar("status", {
    length: 50,
    enum: ["active", "inactive"],
  }).default("active"),
});

export type Organiser = InferSelectModel<typeof organiser>;

export const delegate = pgTable("delegates", {
  id: varchar("id", { length: 128 }).primaryKey(),
  personId: varchar("personId", { length: 10 })
    .references(() => person.id, { onDelete: "cascade" })
    .notNull(),
  status: varchar("status", {
    length: 50,
    enum: ["active", "inactive"],
  }).default("active"),
});

export type Delegate = InferSelectModel<typeof delegate>;

export const competitionOrganiser = pgTable(
  "competition_organisers",
  {
    competitionId: varchar("competitionId", { length: 32 })
      .references(() => competition.id, { onDelete: "cascade" })
      .notNull(),
    organiserId: varchar("organiserId", { length: 128 })
      .references(() => organiser.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.competitionId, t.organiserId] })],
);

export type CompetitionOrganiser = InferSelectModel<
  typeof competitionOrganiser
>;

export const competitionDelegate = pgTable(
  "competition_delegates",
  {
    competitionId: varchar("competitionId", { length: 32 })
      .references(() => competition.id, { onDelete: "cascade" })
      .notNull(),
    delegateId: varchar("delegateId", { length: 128 })
      .references(() => delegate.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.competitionId, t.delegateId] })],
);

export type CompetitionDelegate = InferSelectModel<typeof competitionDelegate>;

export const rankAverage = pgTable(
  "ranksAverage",
  {
    personId: varchar("personId", { length: 10 })
      .notNull()
      .references(() => person.id, { onDelete: "cascade" }),
    eventId: varchar("eventId", { length: 6 })
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    best: integer("best").notNull().default(0),
    worldRank: integer("worldRank").notNull().default(0),
    continentRank: integer("continentRank").notNull().default(0),
    countryRank: integer("countryRank").notNull().default(0),
    // Cubing México
    stateRank: integer("stateRank"),
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.personId, table.eventId] }),
      },
    ];
  },
);

export type RankAverage = InferSelectModel<typeof rankAverage>;

export const rankSingle = pgTable(
  "ranksSingle",
  {
    personId: varchar("personId", { length: 10 })
      .notNull()
      .references(() => person.id, { onDelete: "cascade" }),
    eventId: varchar("eventId", { length: 6 })
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    best: integer("best").notNull().default(0),
    worldRank: integer("worldRank").notNull().default(0),
    continentRank: integer("continentRank").notNull().default(0),
    countryRank: integer("countryRank").notNull().default(0),
    // Cubing México
    stateRank: integer("stateRank"),
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.personId, table.eventId] }),
      },
    ];
  },
);

export type RankSingle = InferSelectModel<typeof rankSingle>;

export const result = pgTable(
  "results",
  {
    competitionId: varchar("competitionId", { length: 32 })
      .notNull()
      .references(() => competition.id, { onDelete: "cascade" }),
    eventId: varchar("eventId", { length: 6 })
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    roundTypeId: varchar("roundTypeId", { length: 1 }),
    pos: smallint("pos").default(0),
    best: integer("best").notNull().default(0),
    average: integer("average").notNull().default(0),
    personId: varchar("personId", { length: 10 })
      .notNull()
      .references(() => person.id, { onDelete: "cascade" }),
    // personCountryId: varchar("personCountryId", { length: 50 }),
    formatId: varchar("formatId", { length: 1 }).notNull(),
    value1: integer("value1").notNull().default(0),
    value2: integer("value2").notNull().default(0),
    value3: integer("value3").notNull().default(0),
    value4: integer("value4").notNull().default(0),
    value5: integer("value5").notNull().default(0),
    regionalSingleRecord: varchar("regionalSingleRecord", { length: 3 }),
    regionalAverageRecord: varchar("regionalAverageRecord", { length: 3 }),
  },
  (table) => {
    return [
      {
        pk: primaryKey({
          columns: [
            table.competitionId,
            table.eventId,
            table.roundTypeId,
            table.pos,
          ],
        }),
      },
    ];
  },
);

export type Result = InferSelectModel<typeof result>;

// Cubing México

export const state = pgTable("states", {
  id: varchar("id", { length: 3 }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
});

export type State = InferSelectModel<typeof state>;

export const team = pgTable("teams", {
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  image: varchar("image", { length: 191 }),
  coverImage: varchar("coverImage", { length: 191 }),
  stateId: varchar("stateId", { length: 3 })
    .notNull()
    .references(() => state.id, { onDelete: "cascade" })
    .primaryKey(),
  founded: timestamp("founded"),
  socialLinks: jsonb("socialLinks").$type<{
    email?: string;
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  }>(),
  isActive: boolean("isActive").notNull().default(true),
});

export type Team = InferSelectModel<typeof team>;

export const teamMember = pgTable("team_members", {
  personId: varchar("personId", { length: 10 })
    .notNull()
    .references(() => person.id, {
      onDelete: "cascade",
    })
    .primaryKey(),
  specialties: jsonb("specialties").$type<string[]>(),
  achievements: jsonb("achievements").$type<string[]>(),
  isAdmin: boolean("isAdmin").notNull().default(false),
});

export type TeamMember = InferSelectModel<typeof teamMember>;

export const teamAchievement = pgTable("team_achievements", {
  stateId: varchar("stateId", { length: 3 })
    .notNull()
    .references(() => state.id, { onDelete: "cascade" })
    .primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
});

export type TeamAchievement = InferSelectModel<typeof teamAchievement>;

export const sumOfRanks = pgTable(
  "sumOfRanks",
  {
    rank: integer("rank").notNull(),
    personId: varchar("personId", { length: 10 })
      .notNull()
      .references(() => person.id, { onDelete: "cascade" }),
    resultType: varchar("resultType", { length: 7 }).notNull(),
    overall: integer("overall").notNull(),
    events: jsonb("events").notNull(),
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.personId, table.resultType] }),
      },
    ];
  },
);

export type SumOfRanks = InferSelectModel<typeof sumOfRanks>;

export const kinchRanks = pgTable(
  "kinchRanks",
  {
    rank: integer("rank").notNull(),
    personId: varchar("personId", { length: 10 })
      .notNull()
      .references(() => person.id, { onDelete: "cascade" }),
    overall: doublePrecision("overall").notNull(),
    events: jsonb("events").notNull(),
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.personId] }),
      },
    ];
  },
);

export type KinchRanks = InferSelectModel<typeof kinchRanks>;

export const exportMetadata = pgTable(
  "exportMetadata",
  {
    id: varchar("id", { length: 32 }).primaryKey(),
    date: timestamp("date").notNull(),
  },
  (table) => {
    return [
      {
        pk: primaryKey({ columns: [table.id] }),
      },
    ];
  },
);

export const sponsor = pgTable("sponsors", {
  id: varchar("id", { length: 32 }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  logo: varchar("logo", { length: 191 }),
  socialLinks: jsonb("socialLinks").$type<{
    email?: string;
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  }>(),
  inCup: boolean("inCup").notNull().default(false),
  active: boolean("active").notNull().default(false),
});

export type Sponsor = InferSelectModel<typeof sponsor>;

export const sponsoredTeam = pgTable("sponsoredTeams", {
  id: varchar("id", { length: 32 }).primaryKey(),
  sponsorId: varchar("sponsorId", { length: 32 })
    .notNull()
    .references(() => sponsor.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 50 }).notNull(),
});

export type SponsoredTeam = InferSelectModel<typeof sponsoredTeam>;

export const sponsoredTeamMember = pgTable("sponsored_team_members", {
  id: varchar("id", { length: 32 }).primaryKey(),
  sponsoredTeamId: varchar("sponsoredTeamId", { length: 32 })
    .notNull()
    .references(() => sponsoredTeam.id, { onDelete: "cascade" }),
  personId: varchar("personId", { length: 10 })
    .notNull()
    .references(() => person.id, { onDelete: "cascade" }),
});

export type SponsoredTeamMember = InferSelectModel<typeof sponsoredTeamMember>;

export const sponsoredCompetitionScore = pgTable(
  "sponsored_competition_scores",
  {
    sponsoredTeamMemberId: varchar("sponsoredTeamMemberId", { length: 32 })
      .notNull()
      .references(() => sponsoredTeamMember.id, { onDelete: "cascade" }),
    competitionId: varchar("competitionId", { length: 32 })
      .notNull()
      .references(() => competition.id, { onDelete: "cascade" }),
    score: real("score").notNull().default(0),
    type: varchar("type", { length: 10, enum: ["pr", "kinch"] }).notNull(),
  },
  (table) => {
    return [
      {
        pk: primaryKey({
          columns: [
            table.sponsoredTeamMemberId,
            table.competitionId,
            table.type,
          ],
        }),
      },
    ];
  },
);

export type SponsoredCompetitionScore = InferSelectModel<
  typeof sponsoredCompetitionScore
>;
