"use client";

import { useState } from "react";
import { CalendarDays, MapPin, LayoutGrid, LayoutList } from "lucide-react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { Badge } from "@workspace/ui/components/badge";
import type { Competition, Event, State } from "@/lib/db/schema";
import { formatCompetitionDateSpanish } from "@/lib/utils";
import { StateSelect } from "../../_components/state-select";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CompetitionsProps {
  upcomingCompetitions: Competition[];
  currentCompetitions: Competition[];
  pastCompetitions: Competition[];
  events: Event[];
  states: State[];
}

export function Competitions({
  upcomingCompetitions,
  currentCompetitions,
  pastCompetitions,
  events,
  states,
}: CompetitionsProps): JSX.Element {
  const params = useParams<{ stateId: string }>()
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [viewMode, setViewMode] = useState<string>("table");
  const state = states.find((state) => state.id === params.stateId);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        {activeTab === "upcoming" && (
          <>
            <h1 className="text-3xl font-bold">
              Competencias próximas en México
            </h1>
            <Badge className="!h-fit">{upcomingCompetitions.length}</Badge>
          </>
        )}
        {activeTab === "current" && (
          <>
            <h1 className="text-3xl font-bold">
              Competencias actuales en México
            </h1>
            <Badge className="!h-fit">{currentCompetitions.length}</Badge>
          </>
        )}
        {activeTab === "past" && (
          <>
            <h1 className="text-3xl font-bold">
              Competencias pasadas en México
            </h1>
            <Badge className="!h-fit">{pastCompetitions.length}</Badge>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div />
        <div className="w-full sm:w-auto">
          <StateSelect states={states} />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Tabs
          className="!w-full"
          defaultValue="upcoming"
          onValueChange={(value) => {
            setActiveTab(value);
          }}
        >
          <TabsList className="!grid !w-[400px] !grid-cols-2">
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            {currentCompetitions.length > 0 && (
              <TabsTrigger value="current">Actuales</TabsTrigger>
            )}
            <TabsTrigger value="past">Pasadas</TabsTrigger>
          </TabsList>
        </Tabs>
        <ToggleGroup
          onValueChange={(value) => value && setViewMode(value)}
          type="single"
          value={viewMode}
        >
          <ToggleGroupItem aria-label="View as table" value="table">
            <LayoutList className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="View as cards" value="cards">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {activeTab === "upcoming" && (
        upcomingCompetitions.length === 0 ? (
          <p>No hay competencias próximas en {state?.name}.</p>
        ) : (
          <>
            {viewMode === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="!w-12">#</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categorías</TableHead>
                    <TableHead>Fechas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingCompetitions.map((competition, index) => {
                    const competitionEvents = competition.eventSpecs?.split(" ");
                    const orderedCompetitionEvents = competitionEvents
                      ?.map((eventId) =>
                        events.find((event) => event.id === eventId),
                      )
                      .filter((event) => event !== undefined)
                      .sort((a, b) => a.rank - b.rank)
                      .map((event) => event.id);

                    return (
                      <TableRow key={competition.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{competition.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {orderedCompetitionEvents?.map((event) => (
                              <span
                                className={`cubing-icon event-${event}`}
                                key={event}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCompetitionDateSpanish(competition)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingCompetitions.map((competition) => {
                  const competitionEvents = competition.eventSpecs?.split(" ");
                  const orderedCompetitionEvents = competitionEvents
                    ?.map((eventId) =>
                      events.find((event) => event.id === eventId),
                    )
                    .filter((event) => event !== undefined)
                    .sort((a, b) => a.rank - b.rank)
                    .map((event) => event.id);

                  return (
                    <Card key={competition.id}>
                      <CardHeader>
                        <CardTitle>{competition.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center mt-2">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {formatCompetitionDateSpanish(competition)}
                          </div>
                          <div className="flex items-center mt-2">
                            <MapPin className="mr-2 h-4 w-4" />
                            {competition.cityName}
                          </div>
                          <div className="flex items-center mt-2">
                            <div className="flex gap-1">
                              {orderedCompetitionEvents?.map((event) => (
                                <span
                                  className={`cubing-icon event-${event}`}
                                  key={event}
                                />
                              ))}
                            </div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Únete a nosotros en esta competencia de la WCA en {state?.name}.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link
                          rel="noopener noreferrer"
                          target="_blank"
                          href={`https://www.worldcubeassociation.org/competitions/${competition.id}`} className={buttonVariants({ variant: "default" })}
                        >
                          Ver más
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ))}

      {activeTab === "past" && (
        pastCompetitions.length === 0 ? (
          <p>No hay competencias pasadas en {state?.name}.</p>
        ) : (
          <>
            {viewMode === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="!w-12">#</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categorías</TableHead>
                    <TableHead>Fechas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastCompetitions.map((competition, index) => {
                    const competitionEvents = competition.eventSpecs?.split(" ");
                    const orderedCompetitionEvents = competitionEvents
                      ?.map((eventId) =>
                        events.find((event) => event.id === eventId),
                      )
                      .filter((event) => event !== undefined)
                      .sort((a, b) => a.rank - b.rank)
                      .map((event) => event.id);

                    return (
                      <TableRow key={competition.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{competition.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {orderedCompetitionEvents?.map((event) => (
                              <span
                                className={`cubing-icon event-${event}`}
                                key={event}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCompetitionDateSpanish(competition)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastCompetitions.map((competition) => {
                  const competitionEvents = competition.eventSpecs?.split(" ");
                  const orderedCompetitionEvents = competitionEvents
                    ?.map((eventId) =>
                      events.find((event) => event.id === eventId),
                    )
                    .filter((event) => event !== undefined)
                    .sort((a, b) => a.rank - b.rank)
                    .map((event) => event.id);

                  return (
                    <Card key={competition.id}>
                      <CardHeader>
                        <CardTitle>{competition.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center mt-2">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {formatCompetitionDateSpanish(competition)}
                          </div>
                          <div className="flex items-center mt-2">
                            <MapPin className="mr-2 h-4 w-4" />
                            {competition.cityName}
                          </div>
                          <div className="flex items-center mt-2">
                            <div className="flex gap-1">
                              {orderedCompetitionEvents?.map((event) => (
                                <span
                                  className={`cubing-icon event-${event}`}
                                  key={event}
                                />
                              ))}
                            </div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Checa los resultados de esta competencia en la WCA.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link
                          rel="noopener noreferrer"
                          target="_blank"
                          href={`https://www.worldcubeassociation.org/competitions/${competition.id}`} className={buttonVariants({ variant: "outline" })}
                        >
                          Ver más
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ))}

      {activeTab === "upcoming" && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            ¿Quieres organizar una competencia?
          </h2>
          <p className="mb-4">
            Si estás interesado en organizar una competencia de la WCA en
            México, por favor ponte en contacto con nosotros. Podemos
            proporcionar orientación y apoyo durante todo el proceso.
          </p>
          <Button variant="outline">Contáctanos</Button>
        </div>
      )}
    </main>
  );
}
