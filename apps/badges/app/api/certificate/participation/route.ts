import { getWCIFByCompetitionId } from "@/db/queries";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const competitionId = searchParams.get("competitionId");
  const wcif = await getWCIFByCompetitionId({
    competitionId: competitionId!,
  });

  const persons = wcif?.persons || [];

  return Response.json(persons);
}
