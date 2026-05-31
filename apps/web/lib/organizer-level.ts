import { sql, type SQL } from "drizzle-orm";

export const ORGANIZER_LEVELS = [
  "Debutante",
  "Super",
  "Experto",
  "Experta",
  "Maestro",
  "Maestra",
  "Leyenda",
] as const;

export type OrganizerLevel = (typeof ORGANIZER_LEVELS)[number];

export const ORGANIZER_LEVEL_FILTERS = [
  "Debutante",
  "Super",
  "Experto",
  "Maestro",
  "Leyenda",
] as const;

export type OrganizerLevelFilter = (typeof ORGANIZER_LEVEL_FILTERS)[number];

export const AMS_ORGANIZER_EXPERIENCE_TABLE_URL =
  "https://docs.google.com/spreadsheets/d/1JrbT94RB9VpDiCdHmGtC-mJeE4Mux6bh/edit?usp=sharing&ouid=116673815176459806406&rtpof=true&sd=true";

export function getOrganizerLevelFilterOptions(
  levelCounts: Partial<Record<OrganizerLevelFilter, number>>,
) {
  return ORGANIZER_LEVEL_FILTERS.map((level, sortIndex) => ({
    label: level,
    value: level,
    count: levelCounts[level] ?? 0,
    sortIndex,
  }));
}

export function toOrganizerLevelFilter(
  level: OrganizerLevel,
): OrganizerLevelFilter {
  if (level === "Experta") return "Experto";
  if (level === "Maestra") return "Maestro";
  return level;
}

export function getOrganizerLevel(
  competitionCount: number,
  gender: string | null,
): OrganizerLevel {
  const isFemale = gender === "f";

  if (competitionCount === 1) {
    return "Debutante";
  }
  if (competitionCount === 2) {
    return "Super";
  }
  if (competitionCount <= 4) {
    return isFemale ? "Experta" : "Experto";
  }
  if (competitionCount === 5) {
    return isFemale ? "Maestra" : "Maestro";
  }
  return "Leyenda";
}

export function organizerLevelSql(
  competitionCountExpr: SQL,
  genderExpr: SQL,
): SQL<string> {
  return sql<string>`CASE
    WHEN ${competitionCountExpr} = 1 THEN 'Debutante'
    WHEN ${competitionCountExpr} = 2 THEN 'Super'
    WHEN ${competitionCountExpr} <= 4 THEN CASE WHEN ${genderExpr} = 'f' THEN 'Experta' ELSE 'Experto' END
    WHEN ${competitionCountExpr} = 5 THEN CASE WHEN ${genderExpr} = 'f' THEN 'Maestra' ELSE 'Maestro' END
    ELSE 'Leyenda'
  END`;
}

export function organizerLevelFilterSql(competitionCountExpr: SQL): SQL<string> {
  return sql<string>`CASE
    WHEN ${competitionCountExpr} = 1 THEN 'Debutante'
    WHEN ${competitionCountExpr} = 2 THEN 'Super'
    WHEN ${competitionCountExpr} <= 4 THEN 'Experto'
    WHEN ${competitionCountExpr} = 5 THEN 'Maestro'
    ELSE 'Leyenda'
  END`;
}
