import { type InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  smallint,
  integer,
  primaryKey,
  timestamp,
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
  wcaDelegate: text("wcaDelegate"),
  organiser: text("organiser"),
  venue: varchar("venue", { length: 240 }).notNull(),
  venueAddress: varchar("venueAddress", { length: 191 }),
  venueDetails: varchar("venueDetails", { length: 191 }),
  external_website: varchar("external_website", { length: 200 }),
  cellName: varchar("cellName", { length: 45 }).notNull(),
  latitude: integer("latitude"),
  longitude: integer("longitude"),
  // Cubing México
  stateId: varchar("stateId", { length: 3 }).references(() => state.id),
});

export type Competition = InferSelectModel<typeof competition>;

export const event = pgTable("events", {
  id: varchar("id", { length: 6 }).primaryKey(),
  name: varchar("name", { length: 54 }).notNull(),
  rank: integer("rank").notNull().default(0),
  format: varchar("format", { length: 10 }).notNull(),
  cellName: varchar("cellName", { length: 45 }).notNull(),
});

export type Event = InferSelectModel<typeof event>;

export const competitionEvent = pgTable("competition_events", {
  competitionId: varchar("competitionId", { length: 32 }).references(
    () => competition.id,
  ),
  eventId: varchar("eventId", { length: 6 }).references(() => event.id),
});

export type CompetitionEvent = InferSelectModel<typeof competitionEvent>;

export const person = pgTable("persons", {
  id: varchar("id", { length: 10 }).primaryKey(),
  name: varchar("name", { length: 80 }),
  gender: varchar("gender", { length: 1 }),
  // Cubing México
  stateId: varchar("stateId", { length: 3 }).references(() => state.id),
});

export type Person = InferSelectModel<typeof person>;

export const rankAverage = pgTable(
  "ranksAverage",
  {
    personId: varchar("personId", { length: 10 })
      .notNull()
      .references(() => person.id),
    eventId: varchar("eventId", { length: 6 })
      .notNull()
      .references(() => event.id),
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
      .references(() => person.id),
    eventId: varchar("eventId", { length: 6 })
      .notNull()
      .references(() => event.id),
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
      .references(() => competition.id),
    eventId: varchar("eventId", { length: 6 })
      .notNull()
      .references(() => event.id),
    roundTypeId: varchar("roundTypeId", { length: 1 }),
    pos: smallint("pos").default(0),
    best: integer("best").notNull().default(0),
    average: integer("average").notNull().default(0),
    personName: varchar("personName", { length: 80 }),
    personId: varchar("personId", { length: 10 })
      .notNull()
      .references(() => person.id),
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
  id: varchar("id", { length: 3 }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  logo: varchar("logo", { length: 191 }),
  stateId: varchar("stateId", { length: 3 })
    .notNull()
    .references(() => state.id),
  facebook: varchar("facebook", { length: 191 }),
  instagram: varchar("instagram", { length: 191 }),
  tiktok: varchar("tiktok", { length: 191 }),
  phoneNumber: varchar("phoneNumber", { length: 15 }),
  email: varchar("email", { length: 191 }),
});

export const sponsor = pgTable("sponsors", {
  id: varchar("id", { length: 3 }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  logo: varchar("logo", { length: 191 }),
  facebook: varchar("facebook", { length: 191 }),
  instagram: varchar("instagram", { length: 191 }),
  tiktok: varchar("tiktok", { length: 191 }),
  phoneNumber: varchar("phoneNumber", { length: 15 }),
  email: varchar("email", { length: 191 }),
  active: integer("active").notNull().default(0),
});
