export const DELEGATE_LEVELS = [
  "trainee_delegate",
  "junior_delegate",
  "full_delegate",
  "senior_delegate",
  "regional_delegate",
] as const;

export type DelegateLevel = (typeof DELEGATE_LEVELS)[number];

export function formatDelegateLevel(
  level: DelegateLevel | null,
  gender?: string | null,
): string | null {
  if (!level) return null;

  switch (level) {
    case "junior_delegate":
      return gender === "m" ? "Delegado Junior" : "Delegada Junior";
    case "senior_delegate":
      return gender === "m" ? "Delegado Senior" : "Delegada Senior";
    case "trainee_delegate":
      return gender === "m"
        ? "Delegado en Entrenamiento"
        : "Delegada en Entrenamiento";
    case "regional_delegate":
      return gender === "m" ? "Delegado Regional" : "Delegada Regional";
    case "full_delegate":
    default:
      return gender === "m"
        ? "Delegado"
        : gender === "f"
          ? "Delegada"
          : "Delegado";
  }
}

export function formatDelegateLevelFilterLabel(level: DelegateLevel): string {
  switch (level) {
    case "junior_delegate":
      return "Delegado Junior";
    case "senior_delegate":
      return "Delegado Senior";
    case "trainee_delegate":
      return "Delegado en Entrenamiento";
    case "regional_delegate":
      return "Delegado Regional";
    case "full_delegate":
    default:
      return "Delegado";
  }
}

export function getDelegateLevelFilterOptions(
  levelCounts: Partial<Record<DelegateLevel, number>>,
) {
  return DELEGATE_LEVELS.map((level, sortIndex) => ({
    label: formatDelegateLevelFilterLabel(level),
    value: level,
    count: levelCounts[level] ?? 0,
    sortIndex,
  }));
}
