import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import "@cubing/icons";
import { getCompetitionsManagedByUser } from "@/db/queries";
import { CompetitionList } from "@/components/competition-list";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page(): Promise<React.JSX.Element> {
  const headersList = await headers();

  const tokenData = await auth.api.getAccessToken({
    body: {
      providerId: "wca",
    },
    headers: headersList,
  });

  const competitions = await getCompetitionsManagedByUser({
    token: tokenData?.accessToken || "",
  });

  const currentDate = new Date();
  const upcomingCompetitions = competitions.filter(
    (competition) =>
      new Date(`${competition.start_date}T00:00:00`) > currentDate,
  );
  const onGoingCompetitions = competitions.filter(
    (competition) =>
      new Date(`${competition.start_date}T00:00:00`) <= currentDate &&
      new Date(`${competition.end_date}T00:00:00`) >= currentDate,
  );
  const pastCompetitions = competitions.filter(
    (competition) => new Date(`${competition.end_date}T00:00:00`) < currentDate,
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Competencias que gestionas
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Explora las competencias próximas, en curso y pasadas que gestionas
            en la WCA.
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="ongoing">En Curso</TabsTrigger>
            <TabsTrigger value="past">Pasadas</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-6">
            <CompetitionList
              competitions={upcomingCompetitions}
              status="upcoming"
            />
          </TabsContent>
          <TabsContent value="ongoing" className="mt-6">
            <CompetitionList
              competitions={onGoingCompetitions}
              status="ongoing"
            />
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            <CompetitionList competitions={pastCompetitions} status="past" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
