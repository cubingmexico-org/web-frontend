import type { PersonalBest, Round, WCIF } from "@/types/wcif";
import { personalBestValue } from "@/types/wcif";

function rankingAcrossLinkedRounds(
  eventRounds: Round[],
  round: Round,
  registrantId: number,
): number | null {
  const ids = [round.id, ...(round.linkedRounds ?? [])];
  let best: number | null = null;
  for (const id of ids) {
    const linked = eventRounds.find((r) => r.id === id);
    const result = linked?.results?.find(
      (r) => r.personId === registrantId && r.ranking != null,
    );
    if (result?.ranking != null) {
      best = best == null ? result.ranking : Math.min(best, result.ranking);
    }
  }
  return best;
}

/** Best ranking for a person in an event, considering dual/linked rounds. */
export function resultRankingForPerson(
  registrantId: number | null,
  eventId: string,
  wcif: WCIF,
): number | null {
  if (registrantId == null) return null;
  const event = wcif.events.find((e) => e.id === eventId);
  if (!event) return null;

  const seen = new Set<string>();
  for (let i = event.rounds.length - 1; i >= 0; i--) {
    const round = event.rounds[i];
    if (!round || seen.has(round.id)) continue;
    for (const id of [round.id, ...(round.linkedRounds ?? [])]) {
      seen.add(id);
    }
    const ranking = rankingAcrossLinkedRounds(
      event.rounds,
      round,
      registrantId,
    );
    if (ranking != null) return ranking;
  }
  return null;
}

export function seedRankFromPersonalBests(
  personalBests: PersonalBest[] | undefined,
  eventId: string,
): number {
  const pb =
    (personalBests ?? []).find(
      (b) => b.eventId === eventId && b.type === "average",
    ) ??
    (personalBests ?? []).find(
      (b) => b.eventId === eventId && b.type === "single",
    );

  if (pb?.worldRanking != null) return pb.worldRanking;
  const value = personalBestValue(pb);
  if (value != null && value > 0) return value;
  return Number.MAX_SAFE_INTEGER;
}

export function seedRankFromWcif(
  person: {
    registrantId: number | null;
    personalBests?: PersonalBest[];
  },
  eventId: string,
  wcif: WCIF,
): number {
  const ranking = resultRankingForPerson(person.registrantId, eventId, wcif);
  if (ranking != null) return ranking;
  return seedRankFromPersonalBests(person.personalBests, eventId);
}
