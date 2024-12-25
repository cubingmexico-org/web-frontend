/* eslint-disable react-hooks/exhaustive-deps -- . */

"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { Label } from "@workspace/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import * as pdfMake from "pdfmake/build/pdfmake";
import type {
  Margins,
  PageOrientation,
  PageSize,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Event, Competition, PodiumData } from "@/types/wca-live";
import {
  processPersons,
  formatResults,
  formatEvents,
  formatPlace,
  formatDates,
  joinPersons,
  transformString,
  formatResultType,
} from "@/lib/utils";
import { columnsEs, columnsEn } from "@/components/podium/columns";
import { DataTable } from "@/components/podium/data-table";
import { FileUploader } from "@/components/file-uploader";
import { podium as podiumEs } from "@/data/es/certificates";
import { podium as podiumEn } from "@/data/en/certificates";
import Tiptap from "@/components/editor/tiptap";
import { fontDeclarations } from "@/lib/fonts";
import type { getDictionary } from "@/get-dictionary";

interface DocumentSettingsProps {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >["certificates"]["podium"]["document_settings"];
  competition: Competition;
  city: string;
}

export default function DocumentSettings({
  dictionary,
  competition,
  city,
}: DocumentSettingsProps): JSX.Element {
  const pathname = usePathname();
  const lang = pathname.startsWith("/es") ? "es" : "en";

  const date = competition.schedule.startDate;
  const days = competition.schedule.numberOfDays;

  const { delegates, organizers, getEventData } = processPersons(
    competition.persons,
  );
  const [pdfData, setPdfData] = useState<PodiumData[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [pageMargins, setPageMargins] = useState<Margins>([40, 60, 40, 60]);
  const [pageOrientation, setPageOrientation] =
    useState<PageOrientation>("landscape");
  const [pageSize, setPageSize] = useState<PageSize>("LETTER");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [files, setFiles] = useState<File[]>([]);
  const [background, setBackground] = useState<string>();

  const [content, setContent] = useState<JSONContent>(
    lang === "es" ? podiumEs : podiumEn,
  );

  const selectedEvents = competition.events.filter(
    (event) => rowSelection[event.id],
  );

  useEffect(() => {
    if (Object.keys(rowSelection).length !== 0) {
      generatePodiumCertificates();
    }
  }, [rowSelection]);

  useEffect(() => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackground(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setBackground(undefined);
    }
  }, [files]);

  function generatePodiumCertificates() {
    const tempPdfData: PodiumData[] = [];

    selectedEvents.map((event: Event) => {
      const results = getEventData(event);

      results.map((result, index: number) => {
        tempPdfData.push({
          name: result.personName,
          place: index + 1,
          event: event.id,
          result: result.result,
        });
      });
    });

    setPdfData(tempPdfData);
  }

  const renderDocumentContent = (content: JSONContent, data: PodiumData) => {
    return content.content
      ?.map((item) => {
        const alignment = item.attrs?.textAlign || "left";
        const text =
          item.content && item.content.length > 0
            ? renderTextContent(item.content, data)
            : "\u00A0";
        switch (item.type) {
          case "paragraph":
            return {
              text,
              style: "paragraph",
              alignment,
            };
          case "heading":
            return {
              text,
              style: `header${item.attrs?.level}`,
              alignment,
            };
          default:
            return null;
        }
      })
      .filter(Boolean);
  };

  const renderTextContent = (
    content: JSONContent["content"],
    data: PodiumData,
  ) => {
    return content
      ?.map((contentItem) => {
        const bold = contentItem.marks?.some((mark) => mark.type === "bold");
        const font =
          contentItem.marks?.find((mark) => mark.type === "textStyle")?.attrs
            ?.fontFamily || "Roboto";
        const fontSize =
          contentItem.marks?.find((mark) => mark.type === "textStyle")?.attrs
            ?.fontSize || "12pt";
        const color =
          contentItem.marks?.find((mark) => mark.type === "textStyle")?.attrs
            ?.color || "#000000";
        const transform =
          (contentItem.marks?.find((mark) => mark.type === "textStyle")?.attrs
            ?.transform as
            | "lowercase"
            | "capitalize"
            | "uppercase"
            | "none"
            | undefined) || "none";

        const textObject = (text: string | undefined) => ({
          text,
          bold,
          font,
          fontSize: parseInt(fontSize as string) * 1.039,
          color,
        });

        switch (contentItem.type) {
          case "text":
            return textObject(
              transformString(contentItem.text || "", transform),
            );
          case "mention":
            switch (contentItem.attrs?.id) {
              case "Delegados":
              case "Delegates":
                return textObject(
                  transformString(joinPersons(delegates, lang), transform),
                );
              case "Organizadores":
              case "Organizers":
                return textObject(
                  transformString(joinPersons(organizers, lang), transform),
                );
              case "Posición (cardinal)":
              case "Ranking (cardinal)":
                return textObject(
                  transformString(
                    formatPlace(data.place, "cardinal", lang),
                    transform,
                  ),
                );
              case "Posición (ordinal)":
              case "Ranking (ordinal)":
                return textObject(
                  transformString(
                    formatPlace(data.place, "ordinal", lang),
                    transform,
                  ),
                );
              case "Posición (ordinal con texto)":
              case "Ranking (ordinal with text)":
                return textObject(
                  transformString(
                    formatPlace(data.place, "ordinal_text", lang),
                    transform,
                  ),
                );
              case "Medalla":
              case "Medal":
                return textObject(
                  transformString(
                    formatPlace(data.place, "medal", lang),
                    transform,
                  ),
                );
              case "Competidor":
              case "Competitor":
                return textObject(transformString(data.name, transform));
              case "Evento":
              case "Event":
                return textObject(
                  transformString(formatEvents(data.event, lang), transform),
                );
              case "Resultado":
              case "Result":
                return textObject(
                  transformString(
                    formatResults(data.result, data.event, lang),
                    transform,
                  ),
                );
              case "Tipo de resultado":
              case "Result type":
                return textObject(
                  transformString(
                    formatResultType(data.event, lang),
                    transform,
                  ),
                );
              case "Competencia":
              case "Competition":
                return textObject(transformString(competition.name, transform));
              case "Fecha":
              case "Date":
                return textObject(
                  transformString(
                    formatDates(date, days.toString(), lang),
                    transform,
                  ),
                );
              case "Ciudad":
              case "City":
                return textObject(transformString(city, transform));
              default:
                return null;
            }
          default:
            return null;
        }
      })
      .filter(Boolean);
  };

  const generatePDF = () => {
    const docDefinition = {
      info: {
        title: `${dictionary.title} - ${competition.name}`,
        author: "Cubing México",
      },
      content: pdfData.map((data, index) => ({
        stack: renderDocumentContent(content, data),
        pageBreak: index < pdfData.length - 1 ? "after" : "",
      })),
      background(currentPage, pageSize) {
        if (background) {
          return {
            image: background,
            width: pageSize.width,
            height: pageSize.height,
          };
        }
        return null;
      },
      pageMargins,
      pageOrientation,
      pageSize,
      styles: {
        header1: {
          fontSize: 33.231,
          lineHeight: 1,
        },
        header2: {
          fontSize: 24.923,
          lineHeight: 1,
        },
        header3: {
          fontSize: 20.769,
          lineHeight: 1,
        },
        header4: {
          fontSize: 16.615,
          lineHeight: 1,
        },
        header5: {
          fontSize: 14.538,
          lineHeight: 1,
        },
        header6: {
          fontSize: 12.462,
          lineHeight: 1,
        },
        paragraph: {
          fontSize: 12.462,
          lineHeight: 1,
        },
      },
      language: "es",
    } as TDocumentDefinitions;

    pdfMake.createPdf(docDefinition, undefined, fontDeclarations).open();
  };

  return (
    <Tabs defaultValue="results">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="results">{dictionary.results}</TabsTrigger>
        <TabsTrigger value="document">{dictionary.document}</TabsTrigger>
      </TabsList>
      <TabsContent value="results">
        <DataTable
          columns={lang === "es" ? columnsEs : columnsEn}
          data={competition.events}
          dictionary={dictionary.data_table}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </TabsContent>
      <TabsContent value="document">
        {isDesktop ? (
          <div className="mt-4">
            <form
              className="grid place-items-center my-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Tiptap
                competitionId={competition.id}
                content={content}
                dictionary={dictionary.tiptap}
                key={`${pageSize}-${pageOrientation}-${pageMargins}`}
                onChange={(newContent: JSONContent) => {
                  setContent(newContent);
                }}
                pageMargins={pageMargins}
                pageOrientation={pageOrientation}
                pageSize={pageSize}
                pdfDisabled={Object.keys(rowSelection).length === 0}
                pdfOnClick={generatePDF}
                setPageMargins={(value: Margins) => {
                  setPageMargins(value);
                }}
                setPageOrientation={(value: PageOrientation) => {
                  setPageOrientation(value);
                }}
                setPageSize={(value: PageSize) => {
                  setPageSize(value);
                }}
                variant="podium"
              />
            </form>
            <div>
              <Label htmlFor="background">{dictionary.background}</Label>
              <FileUploader
                dictionary={dictionary.fileUploader}
                id="background"
                maxFiles={1}
                maxSize={1 * 1024 * 1024}
                onValueChange={(e) => {
                  setFiles(e);
                }}
                value={files}
              />
            </div>
          </div>
        ) : (
          <div className="text-center">{dictionary.mobileFallback}</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
