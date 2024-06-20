/* eslint-disable react/no-array-index-key -- . */
/* eslint-disable @typescript-eslint/restrict-template-expressions -- . */
import { getServerSession } from 'next-auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { authOptions } from "@/lib/auth"
import type { Competition } from '@/types/competitions'
import "@cubing/icons"
import { CardCompetition } from '@/components/card-competition'

export default async function Page(): Promise<JSX.Element> {

  const session = await getServerSession(authOptions)

  const response = await fetch('https://www.worldcubeassociation.org/api/v0/competitions?managed_by_me=true', {
    headers: {
      'Authorization': `Bearer ${session?.token}`,
    },
    cache: 'no-store'
  });

  const currentDate = new Date();
  const competitions = await response.json() as Competition[];
  const upcomingCompetitions = competitions.filter(comp => new Date(comp.start_date) > currentDate);
  const currentCompetitions = competitions.filter(comp => new Date(comp.start_date) <= currentDate && new Date(comp.end_date) >= currentDate);
  const pastCompetitions = competitions.filter(comp => new Date(comp.end_date) < currentDate);

  return (
    <div>
      <h1 className="text-3xl font-bold mt-4 text-center">Bienvenido</h1>
      <p className='text-center m-4'>A continuación se muestran tus competencias como organizador:</p>
      <div className='flex justify-center text-center mx-4'>
        <Tabs className="w-full" defaultValue="current">
          <TabsList>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="current">Actuales</TabsTrigger>
            <TabsTrigger value="past">Pasadas</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Competencias próximas</CardTitle>
                <CardDescription>
                  {upcomingCompetitions.length === 0 ? 'Parece que no tienes ninguna competencia próxima' : 'Estas competencias están próximas a celebrarse'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid grid-cols-1 gap-4 ${upcomingCompetitions.length > 1 ? 'sm:grid-cols-2 ' : ''} ${upcomingCompetitions.length > 2 ? 'md:grid-cols-3' : ''}`}>
                  {upcomingCompetitions.map((competition, index: number) => (
                    <CardCompetition
                      allowParticipationCertificates={false}
                      allowPodiumCertificates={false}
                      competition={competition}
                      key={index}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle>Competencias actuales</CardTitle>
                <CardDescription>
                  {currentCompetitions.length === 0 ? 'Parece que no tienes ninguna competencia siendo celebrada justo ahora' : 'Estas competencias se estan celebrando actualmente'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid grid-cols-1 gap-4 ${currentCompetitions.length > 1 ? 'sm:grid-cols-2 ' : ''} ${currentCompetitions.length > 2 ? 'md:grid-cols-3' : ''}`}>
                  {currentCompetitions.map((competition, index: number) => (
                    <CardCompetition competition={competition} key={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle>Competencias pasadas</CardTitle>
                <CardDescription>
                  {pastCompetitions.length === 0 ? 'Parece que no tienes ninguna competencia pasada' : 'Estas competencias ya fueron celebradas'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid grid-cols-1 gap-4 ${pastCompetitions.length > 1 ? 'sm:grid-cols-2 ' : ''} ${pastCompetitions.length > 2 ? 'md:grid-cols-3' : ''}`}>
                  {pastCompetitions.map((competition, index: number) => (
                    <CardCompetition competition={competition} key={index} />
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
