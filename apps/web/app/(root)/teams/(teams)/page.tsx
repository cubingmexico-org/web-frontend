import { Teams } from "./_components/teams";
import { getTeams } from "./_lib/queries";

export default async function Page() {
  const teams = await getTeams();

  return <Teams teams={teams} />;
}
