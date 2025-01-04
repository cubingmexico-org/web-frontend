/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain -- . */

import { NextResponse } from "next/server";
import JSZip from "jszip";
import { parse } from "papaparse";
import { db } from "@/db";
import type {
  Event,
  Person,
  RankAverage,
  RankSingle,
  Result,
} from "@/db/schema";
import {
  competition,
  event,
  person,
  rankAverage,
  rankSingle,
  result,
  state,
} from "@/db/schema";
import { getStateFromCoordinates } from "@/lib/geocoder";

export const maxDuration = 500;

export async function POST(): Promise<NextResponse> {
  try {
    const response = await fetch(
      "https://www.worldcubeassociation.org/export/results/WCA_export.tsv.zip",
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch zip file: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    const zip = new JSZip();
    const zipContents = await zip.loadAsync(arrayBuffer);

    for (const fileName of Object.keys(zipContents.files)) {
      if (fileName === "WCA_export_Competitions.tsv") {
        console.log("Processing file:", fileName);
        const fileContent = await zipContents.files[fileName]!.async("text");
        const cleanedContent = fileContent.replace(/"/g, "");
        const parsedData = parse(cleanedContent, {
          header: true,
          delimiter: "\t",
          skipEmptyLines: "greedy",
          transform: (value) => (value === "NULL" ? null : value),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).data as any[];

        await db.transaction(async (tx) => {
          const states = await tx.select().from(state);
          for (const row of parsedData) {
            let stateId: string | null = null;

            if (row.countryId === "Mexico") {
              const stateName = await getStateFromCoordinates(
                row.latitude! / 1000000,
                row.longitude! / 1000000,
              );
              if (stateName === null) {
                stateId = null;
              } else {
                stateId = states.find((s) => s.name === stateName)?.id!;
              }
            }

            await tx
              .insert(competition)
              .values({
                id: row.id,
                name: row.name,
                cityName: row.cityName,
                countryId: row.countryId,
                information: row.information,
                startDate: new Date(row.year, row.month - 1, row.day),
                endDate: new Date(row.year, row.endMonth - 1, row.endDay),
                cancelled: row.cancelled,
                eventSpecs: row.eventSpecs,
                wcaDelegate: row.wcaDelegate,
                organiser: row.organiser,
                venue: row.venue,
                venueAddress: row.venueAddress,
                venueDetails: row.venueDetails,
                external_website: row.external_website,
                cellName: row.cellName,
                latitude: row.latitude,
                longitude: row.longitude,
                stateId,
              })
              .onConflictDoNothing();
          }
        });
      }

      if (fileName === "WCA_export_Events.tsv") {
        console.log("Processing file:", fileName);
        const fileContent = await zipContents.files[fileName]!.async("text");
        const parsedData = parse(fileContent, {
          header: true,
          delimiter: "\t",
          skipEmptyLines: "greedy",
        }).data as Event[];

        await db.transaction(async (tx) => {
          for (const row of parsedData) {
            await tx
              .insert(event)
              .values({
                id: row.id,
                format: row.format,
                name: row.name,
                rank: row.rank,
                cellName: row.cellName,
              })
              .onConflictDoNothing();
          }
        });
      }

      if (fileName === "WCA_export_Persons.tsv") {
        console.log("Processing file:", fileName);
        const fileContent = await zipContents.files[fileName]!.async("text");
        const parsedData = parse(fileContent, {
          header: true,
          delimiter: "\t",
          skipEmptyLines: "greedy",
          transform: (value) => (value === "NULL" ? null : value),
        }).data as (Person & { countryId: string })[];

        const cleanedData = parsedData.filter(
          (row) => row.countryId === "Mexico",
        );

        await db.transaction(async (tx) => {
          for (const row of cleanedData) {
            await tx
              .insert(person)
              .values({
                id: row.id,
                name: row.name,
                gender: row.gender,
              })
              .onConflictDoNothing();
          }
        });
      }

      const persons = await db
        .select({
          id: person.id,
        })
        .from(person);
      const personIds = persons.map((p) => p.id);

      if (fileName === "WCA_export_RanksAverage.tsv") {
        console.log("Processing file:", fileName);
        const fileContent = await zipContents.files[fileName]!.async("text");
        const parsedData = parse(fileContent, {
          header: true,
          delimiter: "\t",
          skipEmptyLines: "greedy",
        }).data as RankAverage[];

        const filteredData = parsedData.filter((record) =>
          personIds.includes(record.personId),
        );

        await db.transaction(async (tx) => {
          await tx.delete(rankAverage);

          for (const row of filteredData) {
            await tx
              .insert(rankAverage)
              .values({
                personId: row.personId,
                eventId: row.eventId,
                best: row.best,
                worldRank: row.worldRank,
                continentRank: row.continentRank,
                countryRank: row.countryRank,
              })
              .onConflictDoNothing();
          }
        });
      }

      if (fileName === "WCA_export_RanksSingle.tsv") {
        console.log("Processing file:", fileName);
        const fileContent = await zipContents.files[fileName]!.async("text");
        const parsedData = parse(fileContent, {
          header: true,
          delimiter: "\t",
          skipEmptyLines: "greedy",
        }).data as RankSingle[];

        const filteredData = parsedData.filter((record) =>
          personIds.includes(record.personId),
        );

        await db.transaction(async (tx) => {
          await tx.delete(rankSingle);

          for (const row of filteredData) {
            await tx
              .insert(rankSingle)
              .values({
                personId: row.personId,
                eventId: row.eventId,
                best: row.best,
                worldRank: row.worldRank,
                continentRank: row.continentRank,
                countryRank: row.countryRank,
              })
              .onConflictDoNothing();
          }
        });
      }

      if (fileName === "WCA_export_Results.tsv") {
        console.log("Processing file:", fileName);
        const fileContent =
          await zipContents.files[fileName]!.async("nodebuffer");

        await db.transaction(async (tx) => {
          await tx.delete(result);

          const totalChunks = Math.ceil(fileContent.length / 10000000);
          let headers: string | undefined;

          for (let i = 0; i < totalChunks; i++) {
            const chunk = fileContent
              .slice(i * 10000000, (i + 1) * 10000000)
              .toString();

            if (i === 0) {
              // Extract headers from the first chunk
              const parsedFirstChunk = parse(chunk, {
                header: true,
                delimiter: "\t",
                skipEmptyLines: "greedy",
                transform: (value) => (value === "NULL" ? null : value),
              });
              headers = parsedFirstChunk.meta.fields?.join("\t");
            }

            // Prepend headers to each chunk
            const chunkWithHeaders = `${headers}\n${chunk}`;

            const parsedData = parse(chunkWithHeaders, {
              header: true,
              delimiter: "\t",
              skipEmptyLines: "greedy",
              transform: (value) => (value === "NULL" ? null : value),
            }).data as Result[];

            const filteredData = parsedData.filter(
              (row) => row.personCountryId === "Mexico",
            );

            for (const row of filteredData) {
              await tx
                .insert(result)
                .values({
                  competitionId: row.competitionId,
                  eventId: row.eventId,
                  roundTypeId: row.roundTypeId,
                  pos: row.pos,
                  best: row.best,
                  average: row.average,
                  personName: row.personName,
                  personId: row.personId,
                  personCountryId: row.personCountryId,
                  formatId: row.formatId,
                  value1: row.value1,
                  value2: row.value2,
                  value3: row.value3,
                  value4: row.value4,
                  value5: row.value5,
                  regionalSingleRecord: row.regionalSingleRecord,
                  regionalAverageRecord: row.regionalAverageRecord,
                })
                .onConflictDoNothing();
            }
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error updating database" },
      { status: 500 },
    );
  }
}
