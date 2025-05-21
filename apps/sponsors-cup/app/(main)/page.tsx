import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  getIndividualScoreboard,
  getKinchScoreboard,
  getPRScoreboard,
} from "@/db/queries";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";
import {
  IndividualScoreboardTable,
  ScoreboardTable,
} from "@/components/scoreboard-table";

export default async function Page(): Promise<JSX.Element> {
  const [prs, kinchs, individual] = await Promise.all([
    getPRScoreboard(),
    getKinchScoreboard(),
    getIndividualScoreboard(),
  ]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center">Tableros</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="teams-prs" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="teams-prs">PRs (equipos)</TabsTrigger>
              <TabsTrigger value="kinch">Kinch (equipos)</TabsTrigger>
              <TabsTrigger value="individual-prs">PRs (individual)</TabsTrigger>
            </TabsList>

            <TabsContent value="teams-prs">
              <ScoreboardTable teams={prs} />
            </TabsContent>

            <TabsContent value="kinch">
              <ScoreboardTable teams={kinchs} />
            </TabsContent>

            <TabsContent value="individual-prs">
              <IndividualScoreboardTable competitors={individual} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
