/* eslint-disable react/no-array-index-key -- . */

import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { auth } from "@/auth";
import "@cubing/icons";
import { CardCompetition } from "@/components/card-competition";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { fetchCompetitions } from "@/app/[lang]/actions";

interface PageProps {
  params: {
    lang: Locale;
  };
}

export default async function Page({
  params,
}: PageProps): Promise<JSX.Element> {
  const dictionary = await getDictionary(params.lang);

  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const competitions = await fetchCompetitions(session.token || "");
  const currentDate = new Date();
  const upcomingCompetitions = competitions.filter(
    (competition) => new Date(competition.start_date) > currentDate,
  );
  const currentCompetitions = competitions.filter(
    (competition) =>
      new Date(competition.start_date) <= currentDate &&
      new Date(competition.end_date) >= currentDate,
  );
  const pastCompetitions = competitions.filter(
    (competition) => new Date(competition.end_date) < currentDate,
  );

  return (
    <div className="grid gap-4 mx-4">
      <h1 className="text-3xl font-bold text-center mt-4">
        {dictionary.certificates.welcomeTitle}
      </h1>
      <p className="text-center">{dictionary.certificates.introText}</p>
      <div className="flex justify-center text-center">
        <Tabs className="w-full" defaultValue="current">
          <TabsList>
            <TabsTrigger value="upcoming">
              {dictionary.certificates.tabs.upcoming}
            </TabsTrigger>
            <TabsTrigger value="current">
              {dictionary.certificates.tabs.current}
            </TabsTrigger>
            <TabsTrigger value="past">
              {dictionary.certificates.tabs.past}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionary.certificates.competitions.upcomingTitle}
                </CardTitle>
                <CardDescription>
                  {upcomingCompetitions.length === 0
                    ? dictionary.certificates.competitions.noUpcoming
                    : dictionary.certificates.competitions.upcomingDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`grid grid-cols-1 gap-4 ${upcomingCompetitions.length > 1 ? "sm:grid-cols-2 " : ""} ${upcomingCompetitions.length > 2 ? "md:grid-cols-3" : ""}`}
                >
                  {upcomingCompetitions.map((competition, index: number) => {
                    const upcomingCurrentDate = new Date();
                    const registrationCloseDate = new Date(
                      competition.registration_close,
                    );

                    const allowCertificates =
                      registrationCloseDate < upcomingCurrentDate;

                    return (
                      <CardCompetition
                        allowDesign={allowCertificates}
                        allowParticipationCertificates={false}
                        allowPodiumCertificates={false}
                        competition={competition}
                        dictionary={dictionary.card_competition}
                        key={index}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionary.certificates.competitions.currentTitle}
                </CardTitle>
                <CardDescription>
                  {currentCompetitions.length === 0
                    ? dictionary.certificates.competitions.noCurrent
                    : dictionary.certificates.competitions.currentDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`grid grid-cols-1 gap-4 ${currentCompetitions.length > 1 ? "sm:grid-cols-2 " : ""} ${currentCompetitions.length > 2 ? "md:grid-cols-3" : ""}`}
                >
                  {currentCompetitions.map((competition, index: number) => (
                    <CardCompetition
                      competition={competition}
                      dictionary={dictionary.card_competition}
                      key={index}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>
                  {dictionary.certificates.competitions.pastTitle}
                </CardTitle>
                <CardDescription>
                  {pastCompetitions.length === 0
                    ? dictionary.certificates.competitions.noPast
                    : dictionary.certificates.competitions.pastDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`grid grid-cols-1 gap-4 ${pastCompetitions.length > 1 ? "sm:grid-cols-2 " : ""} ${pastCompetitions.length > 2 ? "md:grid-cols-3" : ""}`}
                >
                  {pastCompetitions.map((competition, index: number) => (
                    <CardCompetition
                      competition={competition}
                      dictionary={dictionary.card_competition}
                      key={index}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
