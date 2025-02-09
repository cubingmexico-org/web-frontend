import { type InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  smallint,
  integer,
  primaryKey,
  timestamp,
  boolean,
  json,
  doublePrecision,
} from "drizzle-orm/pg-core";
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"

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
  gender: varchar("gender", { length: 1 }),
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
  id: varchar("id", { length: 3 }).primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  logo: varchar("logo", { length: 191 }),
  stateId: varchar("stateId", { length: 3 })
    .notNull()
    .references(() => state.id, { onDelete: "cascade" }),
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

export const sumOfRanks = pgTable(
  "sumOfRanks",
  {
    rank: integer("rank").notNull(),
    personId: varchar("personId", { length: 10 })
      .notNull()
      .references(() => person.id, { onDelete: "cascade" }),
    resultType: varchar("resultType", { length: 7 }).notNull(),
    overall: integer("overall").notNull(),
    events: json("events").notNull(),
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
    events: json("events").notNull(),
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

// Auth

const connectionString = process.env.DATABASE_URL!
const pool = postgres(connectionString, { max: 1 })
 
export const db = drizzle(pool)
 
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)
