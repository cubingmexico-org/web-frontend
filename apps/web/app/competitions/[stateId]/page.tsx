import { sql } from "drizzle-orm";
import { competition, state, event } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { Competitions } from "./_components/competitions";

type Params = Promise<{ stateId: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { stateId } = await params;

  const competitions = await db
    .select()
    .from(competition)
    .where(sql`${competition.stateId} = ${stateId}`)
    .orderBy(
      sql`${competition.year} DESC`,
      sql`${competition.month} DESC`,
      sql`${competition.day} DESC`,
    );

  const states = await db.select().from(state);

  const events = await db
    .select()
    .from(event)
    .where(sql`${event.rank} < 200`)
    .orderBy(event.rank);

    const upcomingCompetitions = competitions
    .filter((comp) => {
      const today = new Date();
      const compDate = new Date(comp.year, comp.month - 1, comp.day);
      return compDate >= today;
    })
    .reverse();


    const currentCompetitions = competitions.filter((comp) => {
      const today = new Date();
      const compStartDate = new Date(comp.year, comp.month - 1, comp.day);
      const compEndDate = new Date(comp.year, comp.endMonth - 1, comp.endDay);
      return compStartDate <= today && compEndDate >= today;
    });
  
    const pastCompetitions = competitions.filter((comp) => {
      const today = new Date();
      const compDate = new Date(comp.year, comp.month - 1, comp.day);
      return compDate < today;
    });

  return (
    <Competitions
      currentCompetitions={currentCompetitions}
      events={events}
      pastCompetitions={pastCompetitions}
      states={states}
      upcomingCompetitions={upcomingCompetitions}
    />
  );
}
