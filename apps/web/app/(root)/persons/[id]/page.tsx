/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { db } from "@/db";
import { and, countDistinct, eq, gt, inArray } from "drizzle-orm";
import { person, rankAverage, rankSingle, result, state } from "@/db/schema";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import Image from "next/image";
import { getEvents } from "@/db/queries";
import { formatTime, formatTime333mbf } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const response = await fetch(
    `https://www.worldcubeassociation.org/api/v0/persons/${id}`,
  );

  const data = (await response.json()) as {
    person: {
      name: string;
      gender: string;
      url: string;
      country: {
        id: string;
        name: string;
        continentId: string;
        iso2: string;
      };
      delegate_status: string;
      // teams: any[];
      avatar: {
        id: number;
        status: string;
        thumbnail_crop_x: null;
        thumbnail_crop_y: null;
        thumbnail_crop_w: null;
        thumbnail_crop_h: null;
        url: string;
        thumb_url: string;
        is_default: boolean;
        can_edit_thumbnail: boolean;
      };
      wca_id: string;
      country_iso2: string;
      id: string;
    };
    competition_count: number;
    personal_records: {
      [key: string]: {
        single: {
          best: number;
          world_rank: number;
          continent_rank: number;
          country_rank: number;
        };
        average: {
          best: number;
          world_rank: number;
          continent_rank: number;
          country_rank: number;
        };
      };
    };
    medals: {
      gold: number;
      silver: number;
      bronze: number;
      total: number;
    };
    records: {
      national: number;
      continental: number;
      world: number;
      total: number;
    };
  };

  const events = await getEvents();

  const persons = await db
    .select({ state: state.name })
    .from(person)
    .leftJoin(state, eq(person.stateId, state.id))
    .where(eq(person.id, id));

  const singleStateRanks = await db
    .select({ stateRank: rankSingle.stateRank, eventId: rankSingle.eventId })
    .from(rankSingle)
    .where(eq(rankSingle.personId, id));

  const averageStateRanks = await db
    .select({ stateRank: rankAverage.stateRank, eventId: rankAverage.eventId })
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

  const bronze = await db
    .select({
      id: person.id,
      name: person.name,
      gender: person.gender,
      state: state.name,
    })
    .from(person)
    .innerJoin(result, eq(person.id, result.personId))
    .leftJoin(state, eq(person.stateId, state.id))
    .where(
      and(
        eq(person.id, id),
        inArray(
          result.eventId,
          events.map((event) => event.id),
        ),
        gt(result.best, 0),
      ),
    )
    .groupBy(person.id, person.name, person.gender, state.name)
    .having(eq(countDistinct(result.eventId), events.length));

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-center font-semibold text-2xl mb-6">
        {data.person.name}
      </h1>
      {bronze.length > 0 && (
        <div className="w-full flex justify-center mb-2">
          <Badge>Miembro Bronce</Badge>
        </div>
      )}
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
              {data.person.gender === "m" ? "Masculino" : "Femenino"}
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
            <TableHead className="text-center">SR</TableHead>
            <TableHead className="text-center">NR</TableHead>
            <TableHead className="text-center">CR</TableHead>
            <TableHead className="text-center">WR</TableHead>
            <TableHead className="text-center">Single</TableHead>
            <TableHead className="text-center">Average</TableHead>
            <TableHead className="text-center">WR</TableHead>
            <TableHead className="text-center">CR</TableHead>
            <TableHead className="text-center">NR</TableHead>
            <TableHead className="text-center">SR</TableHead>
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
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.single.state_rank === 1 &&
                    "font-semibold text-green-500",
                )}
              >
                {record?.record?.single.state_rank ??
                  (!record.event && (
                    <span className="text-muted-foreground font-thin">N/A</span>
                  ))}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.single.country_rank === 1 &&
                    "font-semibold text-green-500",
                )}
              >
                {record?.record?.single.country_rank}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.single.continent_rank === 1 &&
                    "font-semibold text-green-500",
                )}
              >
                {record?.record?.single.continent_rank}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.single.world_rank === 1 &&
                    "font-semibold text-green-500",
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
                    "font-semibold text-green-500",
                )}
              >
                {record?.record?.average?.world_rank}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.average.continent_rank === 1 &&
                    "font-semibold text-green-500",
                )}
              >
                {record?.record?.average?.continent_rank}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.average.country_rank === 1 &&
                    "font-semibold text-green-500",
                )}
              >
                {record?.record?.average?.country_rank}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center",
                  record?.record?.average.state_rank === 1 &&
                    "font-semibold text-green-500",
                )}
              >
                {record?.record?.average.state_rank ??
                  (!record.event && (
                    <span className="text-muted-foreground font-thin">N/A</span>
                  ))}
              </TableCell>
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
    </main>
  );
}
