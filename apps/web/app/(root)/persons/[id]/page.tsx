/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

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
import {
  formatTime,
  formatTime333mbf,
  getTier,
  getTierClass,
} from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import type { GeoJSONProps } from "react-leaflet";
import Link from "next/link";
import type { Metadata } from "next";
import { MapContainer } from "./_components/map-container";
import { getStatesGeoJSON } from "@/db/queries";
import {
  getAverageStateRanks,
  getIsOrganizer,
  getMembershipData,
  getPersonInfo,
  getSingleStateRanks,
  getWcaPersonData,
} from "./_lib/queries";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { DelegateStatus } from "@/types/wca";

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

  const [person, wcaData, events] = await Promise.all([
    getPersonInfo(id),
    getWcaPersonData(id),
    getEvents(),
  ]);

  if (!person || !wcaData) {
    notFound();
  }

  const headersList = await headers();
  const domain = headersList.get("host");
  const isProduction = process.env.NODE_ENV === "production";

  const statesData = await getStatesGeoJSON(
    isProduction ? `https://${domain}` : `http://${domain}`,
  );

  const stateIds = person.statesNames;

  const filteredStatesData = statesData?.features.filter((feature) =>
    stateIds?.includes(feature.properties.id),
  ) as unknown as GeoJSONProps["data"];

  const [singleStateRanks, averageStateRanks, membershipData, isOrganizer] =
    await Promise.all([
      getSingleStateRanks(id),
      getAverageStateRanks(id),
      getMembershipData(
        id,
        events.map((event) => event.id),
      ),
      getIsOrganizer(id),
    ]);

  const isDelegate = wcaData.person.delegate_status !== null;

  const tier = getTier(membershipData);

  const records = events
    .filter((event) => wcaData.personal_records[event.id])
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
          ...wcaData.personal_records[event.id],
          single: {
            ...wcaData.personal_records[event.id]?.single,
            state_rank: singleStateRank ?? undefined,
          },
          average: {
            ...wcaData.personal_records[event.id]?.average,
            state_rank: averageStateRank ?? undefined,
          },
        },
      };
    });

  const SRcount =
    singleStateRanks.filter((rank) => rank.stateRank === 1).length +
    averageStateRanks.filter((rank) => rank.stateRank === 1).length;

  function formatDelegateStatus(status: DelegateStatus, gender: string) {
    switch (status) {
      case "junior_delegate":
        return gender === "m" ? "Delegado Junior" : "Delegada Junior";
      case "senior_delegate":
        return gender === "m" ? "Delegado Senior" : "Delegada Senior";
      case "trainee_delegate":
        return gender === "m"
          ? "Delegado en Entrenamiento"
          : "Delegada en Entrenamiento";
      case "regional_delegate":
        return gender === "m" ? "Delegado Regional" : "Delegada Regional";
      case "full_delegate":
      default:
        return gender === "m"
          ? "Delegado"
          : gender === "f"
            ? "Delegada"
            : "Delegado";
    }
  }

  return (
    <>
      <h1 className="text-center font-semibold text-2xl mb-4 hover:underline">
        <Link
          href={`https://www.worldcubeassociation.org/persons/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {wcaData?.person.name}
        </Link>
      </h1>
      <div className="w-full flex justify-center gap-2 mb-2">
        {tier && <Badge className={getTierClass(tier)}>Miembro {tier}</Badge>}
        {isDelegate && (
          <Badge>
            {formatDelegateStatus(
              wcaData.person.delegate_status,
              wcaData.person.gender,
            )}
          </Badge>
        )}
        {isOrganizer && (
          <Badge variant="outline">
            {wcaData?.person.gender === "m"
              ? "Organizador"
              : wcaData?.person.gender === "f"
                ? "Organizadora"
                : null}
          </Badge>
        )}
      </div>
      <div className="w-full flex justify-center mb-6">
        <Image
          src={wcaData?.person.avatar.url || "/placeholder.svg"}
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
              {person.state ?? (
                <span className="text-muted-foreground font-thin">N/A</span>
              )}
            </TableCell>
            <TableCell className="text-center">
              {wcaData.person.wca_id}
            </TableCell>
            <TableCell className="text-center">
              {wcaData.person.gender === "m"
                ? "Masculino"
                : wcaData.person.gender === "f"
                  ? "Femenino"
                  : "Otro"}
            </TableCell>
            <TableCell className="text-center">
              {wcaData.competition_count}
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
            {person.state && <TableHead className="text-center">SR</TableHead>}
            <TableHead className="text-center">NR</TableHead>
            <TableHead className="text-center">CR</TableHead>
            <TableHead className="text-center">WR</TableHead>
            <TableHead className="text-center">Single</TableHead>
            <TableHead className="text-center">Average</TableHead>
            <TableHead className="text-center">WR</TableHead>
            <TableHead className="text-center">CR</TableHead>
            <TableHead className="text-center">NR</TableHead>
            {person.state && <TableHead className="text-center">SR</TableHead>}
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
              {person.state && (
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
              {person.state && (
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
                  {wcaData.medals.gold}
                </TableCell>
                <TableCell className="text-center">
                  {wcaData.medals.silver}
                </TableCell>
                <TableCell className="text-center">
                  {wcaData.medals.bronze}
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
                  {wcaData.records.world}
                </TableCell>
                <TableCell className="text-center">
                  {wcaData.records.continental}
                </TableCell>
                <TableCell className="text-center">
                  {wcaData.records.national}
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
          {stateIds?.[0] === null || stateIds === null ? 0 : stateIds?.length}
        </Badge>
      </h2>
      <MapContainer statesData={filteredStatesData} />
    </>
  );
}
