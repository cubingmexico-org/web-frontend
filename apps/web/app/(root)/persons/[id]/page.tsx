/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { db } from "@/db";
import { and, countDistinct, eq, gt, inArray, sql } from "drizzle-orm";
import {
  championship,
  competition,
  delegate,
  organiser,
  person,
  rankAverage,
  rankSingle,
  result,
  state,
} from "@/db/schema";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import Image from "next/image";
import { getEvents, getPerson } from "@/db/queries";
import { formatTime, formatTime333mbf, getTier } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import { type GeoJSONProps } from "react-leaflet";
import { headers } from "next/headers";
import Link from "next/link";
import {
  BLD_FMC_MEANS_EVENTS,
  SPEEDSOLVING_AVERAGES_EVENTS,
} from "@/lib/constants";
import { unstable_cache } from "@/lib/unstable-cache";
import { Tier } from "@/types";
import type { Metadata } from "next";
import { MapContainer } from "./_components/map-container";

const isProduction = process.env.NODE_ENV === "production";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;

  const person = await getPerson(id);

  return {
    title: `${person?.name} | Cubing México`,
    description: `Resultados de ${person?.name}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const headersList = await headers();
  const domain = headersList.get("host");

  const data = await unstable_cache(
    async () => {
      const response = await fetch(
        `https://www.worldcubeassociation.org/api/v0/persons/${id}`,
      );
      return response.json();
    },
    [id],
    {
      revalidate: 3600,
      tags: ["wca-person"],
    },
  )();

  const events = await getEvents();

  const { persons, SRcount, records, tier, isDelegate, isOrganiser } =
    await unstable_cache(
      async () => {
        return await db.transaction(async (tx) => {
          const persons = await tx
            .select({
              state: state.name,
              statesNames: sql`array_agg(DISTINCT ${competition.stateId})`,
            })
            .from(person)
            .leftJoin(state, eq(person.stateId, state.id))
            .leftJoin(result, eq(person.id, result.personId))
            .leftJoin(competition, eq(result.competitionId, competition.id))
            .where(eq(person.id, id))
            .groupBy(state.name);

          const singleStateRanks = await tx
            .select({
              stateRank: rankSingle.stateRank,
              eventId: rankSingle.eventId,
            })
            .from(rankSingle)
            .where(eq(rankSingle.personId, id));

          const averageStateRanks = await tx
            .select({
              stateRank: rankAverage.stateRank,
              eventId: rankAverage.eventId,
            })
            .from(rankAverage)
            .where(eq(rankAverage.personId, id));

          const SRcount =
            singleStateRanks.filter((rank) => rank.stateRank === 1).length +
            averageStateRanks.filter((rank) => rank.stateRank === 1).length;

          const records = events
            .filter((event) => data.personal_records[event.id])
            .map((event) => {
              const singleStateRank = singleStateRanks.find(
                (rank) => rank.eventId === event.id,
              )?.stateRank;
              const averageStateRank = averageStateRanks.find(
                (rank) => rank.eventId === event.id,
              )?.stateRank;

              return {
                event: event.id,
                record: {
                  ...data.personal_records[event.id],
                  single: {
                    ...data.personal_records[event.id]?.single,
                    state_rank: singleStateRank ?? undefined,
                  },
                  average: {
                    ...data.personal_records[event.id]?.average,
                    state_rank: averageStateRank ?? undefined,
                  },
                },
              };
            });

          const membershipData = await db
            .select({
              numberOfSpeedsolvingAverages: sql<number>`COUNT(DISTINCT CASE WHEN ${result.eventId} IN(${sql.join(SPEEDSOLVING_AVERAGES_EVENTS, sql`, `)}) AND ${result.average} > 0 THEN ${result.eventId} ELSE NULL END)`,
              numberOfBLDFMCMeans: sql<number>`COUNT(DISTINCT CASE WHEN ${result.eventId} IN(${sql.join(BLD_FMC_MEANS_EVENTS, sql`, `)}) AND ${result.average} > 0 THEN ${result.eventId} ELSE NULL END)`,
              hasWorldRecord: sql<boolean>`MAX(CASE WHEN ${result.regionalSingleRecord} = 'WR' OR ${result.regionalAverageRecord} = 'WR' THEN 1 ELSE 0 END) = 1`,
              hasWorldChampionshipPodium: sql<boolean>`MAX(CASE WHEN ${result.pos} IN(1, 2, 3) AND ${result.roundTypeId} IN('f', 'c') AND ${championship.championshipType} = 'world' THEN 1 ELSE 0 END) = 1`,
              eventsWon: sql<number>`COUNT(DISTINCT CASE WHEN ${result.pos} = 1 AND ${result.roundTypeId} IN('f', 'c') THEN ${result.eventId} ELSE NULL END)`,
            })
            .from(result)
            .leftJoin(
              championship,
              eq(result.competitionId, championship.competitionId),
            )
            .where(
              and(
                eq(result.personId, id),
                inArray(
                  result.eventId,
                  events.map((event) => event.id),
                ),
                gt(result.best, 0),
              ),
            )
            .having(eq(countDistinct(result.eventId), events.length));

          const tier = getTier(membershipData[0]!);

          const isDelegate = await tx
            .select()
            .from(delegate)
            .where(
              and(eq(delegate.personId, id), eq(delegate.status, "active")),
            );

          const isOrganiser = await tx
            .select()
            .from(organiser)
            .where(
              and(eq(organiser.personId, id), eq(organiser.status, "active")),
            );

          return {
            persons,
            singleStateRanks,
            averageStateRanks,
            SRcount,
            records,
            tier,
            isDelegate,
            isOrganiser,
          };
        });
      },
      [id],
      {
        revalidate: 3600,
        tags: ["person"],
      },
    )();

  const states = await unstable_cache(
    async () => {
      const response = await fetch(
        `${isProduction ? "https://" : "http://"}` + domain + "/states.geojson",
      );
      return response.json();
    },
    [],
    {
      revalidate: false,
      tags: ["geojson"],
    },
  )();

  const statesData = states as {
    type: string;
    features: {
      type: string;
      properties: {
        id: string;
        name: string;
      };
      geometry: {
        type: string;
        coordinates: number[][][][];
      };
    }[];
  };

  const filteredStatesData = statesData.features.filter((feature) =>
    (persons[0]?.statesNames as string[]).includes(feature.properties.id),
  ) as unknown as GeoJSONProps["data"];

  const getTierClass = (tier: Tier): string => {
    switch (tier) {
      case "Plata":
        return "bg-gradient-to-r from-gray-300 to-gray-500 border-0";
      case "Oro":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 border-0";
      case "Platino":
        return "bg-gradient-to-r from-gray-100 to-gray-300 border-0";
      case "Ópalo":
        return "bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 border-0";
      case "Diamante":
        return "bg-gradient-to-r from-blue-200 to-blue-400 border-0";
      case "Bronce":
      default:
        return "bg-gradient-to-r from-amber-500 to-amber-700 border-0";
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-center font-semibold text-2xl mb-4 hover:underline">
        <Link
          href={`https://www.worldcubeassociation.org/persons/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {data.person.name}
        </Link>
      </h1>
      <div className="w-full flex justify-center gap-2 mb-2">
        {tier && <Badge className={getTierClass(tier)}>Miembro {tier}</Badge>}
        {isDelegate.length > 0 && (
          <Badge>
            {data.person.gender === "m"
              ? "Delegado"
              : data.person.gender === "f"
                ? "Delegada"
                : null}
          </Badge>
        )}
        {isOrganiser.length > 0 && (
          <Badge variant="outline">
            {data.person.gender === "m"
              ? "Organizador"
              : data.person.gender === "f"
                ? "Organizadora"
                : null}
          </Badge>
        )}
      </div>
      <div className="w-full flex justify-center mb-6">
        <Image
          src={data.person.avatar.url}
          alt="Avatar"
          width={300}
          height={300}
          className="rounded"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">WCA ID</TableHead>
            <TableHead className="text-center">Sexo</TableHead>
            <TableHead className="text-center">Competencias</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
              {persons[0]?.state ?? (
                <span className="text-muted-foreground font-thin">N/A</span>
              )}
            </TableCell>
            <TableCell className="text-center">{data.person.wca_id}</TableCell>
            <TableCell className="text-center">
              {data.person.gender === "m"
                ? "Masculino"
                : data.person.gender === "f"
                  ? "Femenino"
                  : "Otro"}
            </TableCell>
            <TableCell className="text-center">
              {data.competition_count}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <h2 className="text-center text-lg font-semibold my-4">
        Récords personales actuales
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            {persons[0]?.state && (
              <TableHead className="text-center">SR</TableHead>
            )}
            <TableHead className="text-center">NR</TableHead>
            <TableHead className="text-center">CR</TableHead>
            <TableHead className="text-center">WR</TableHead>
            <TableHead className="text-center">Single</TableHead>
            <TableHead className="text-center">Average</TableHead>
            <TableHead className="text-center">WR</TableHead>
            <TableHead className="text-center">CR</TableHead>
            <TableHead className="text-center">NR</TableHead>
            {persons[0]?.state && (
              <TableHead className="text-center">SR</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.event}>
              <TableCell>
                <span
                  key={record.event}
                  className={`cubing-icon event-${record.event}`}
                />
              </TableCell>
              {persons[0]?.state && (
                <TableCell
                  className={cn(
                    "text-center",
                    record?.record?.single.state_rank === 1 &&
                      "font-semibold text-blue-700",
                  )}
                >
                  {record?.record?.single.state_rank ??
                    (!record.event && (
                      <span className="text-muted-foreground font-thin">
                        N/A
                      </span>
                    ))}
                </TableCell>
              )}
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.single.country_rank === 1 &&
                    "font-semibold text-blue-700",
                )}
              >
                {record?.record?.single.country_rank}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.single.continent_rank === 1 &&
                    "font-semibold text-blue-700",
                )}
              >
                {record?.record?.single.continent_rank}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.single.world_rank === 1 &&
                    "font-semibold text-blue-700",
                )}
              >
                {record?.record?.single.world_rank}
              </TableCell>
              <TableCell className="text-center">
                {record.event === "333mbf"
                  ? formatTime333mbf(record?.record?.single.best!)
                  : record.event === "333fm"
                    ? record?.record?.single.best
                    : formatTime(record?.record?.single.best!)}
              </TableCell>
              <TableCell className="text-center">
                {record?.record?.average?.best
                  ? formatTime(record?.record?.average?.best)
                  : null}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.average.world_rank === 1 &&
                    "font-semibold text-blue-700",
                )}
              >
                {record?.record?.average?.world_rank}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.average.continent_rank === 1 &&
                    "font-semibold text-blue-700",
                )}
              >
                {record?.record?.average?.continent_rank}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.average.country_rank === 1 &&
                    "font-semibold text-blue-700",
                )}
              >
                {record?.record?.average?.country_rank}
              </TableCell>
              {persons[0]?.state && (
                <TableCell
                  className={cn(
                    "text-center",
                    record?.record?.average.state_rank === 1 &&
                      "font-semibold text-blue-700",
                  )}
                >
                  {record?.record?.average.state_rank ??
                    (!record.event && (
                      <span className="text-muted-foreground font-thin">
                        N/A
                      </span>
                    ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-6">
        <div>
          <h3 className="text-center font-semibold mb-2">Medallas</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Oro</TableHead>
                <TableHead className="text-center">Plata</TableHead>
                <TableHead className="text-center">Bronce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                  {data.medals.gold}
                </TableCell>
                <TableCell className="text-center">
                  {data.medals.silver}
                </TableCell>
                <TableCell className="text-center">
                  {data.medals.bronze}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-center font-semibold mb-2">Récords</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">WR</TableHead>
                <TableHead className="text-center">CR</TableHead>
                <TableHead className="text-center">NR</TableHead>
                <TableHead className="flex items-center gap-2 justify-center">
                  SR
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Récords actuales, no histórico</p>
                    </TooltipContent>
                  </Tooltip>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                  {data.records.world}
                </TableCell>
                <TableCell className="text-center">
                  {data.records.continental}
                </TableCell>
                <TableCell className="text-center">
                  {data.records.national}
                </TableCell>
                <TableCell className="text-center">{SRcount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <h2 className="flex items-center justify-center gap-2 text-lg font-semibold my-4">
        <span>Estados visitados</span>
        <Badge>
          {(persons[0]?.statesNames as string[])[0] === null
            ? 0
            : (persons[0]?.statesNames as string[]).length}
        </Badge>
      </h2>
      <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
        <MapContainer statesData={filteredStatesData} />
      </div>
    </main>
  );
}
