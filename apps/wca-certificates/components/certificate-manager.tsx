"use client";

import { useEffect, useState } from "react";
import { format, formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Progress } from "@workspace/ui/components/progress";
import { Separator } from "@workspace/ui/components/separator";
import {
  Award,
  FileText,
  RefreshCw,
  Settings,
  Eye,
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  Home,
  Check,
} from "lucide-react";
import { Competition } from "@/types/wca";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import Link from "next/link";
import useSWR from "swr";
import { notFound } from "next/navigation";
import {
  fetcher,
  formatDates,
  formatEvents,
  formatPlace,
  formatResults,
  formatResultType,
  joinPersons,
  transformString,
} from "@/lib/utils";
import { ParticipantData, Person, PodiumData } from "@/types/wcif";
import Tiptap from "./editor/tiptap";
import { participation, podium } from "@/data/certificates";
import { JSONContent } from "@tiptap/react";
import {
  Margins,
  PageOrientation,
  PageSize,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import { fontDeclarations } from "@/lib/fonts";
import * as pdfMake from "pdfmake/build/pdfmake";
import { CertificateManagerSkeleton } from "./certificate-manager-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Toggle } from "@workspace/ui/components/toggle";
import { Input } from "@workspace/ui/components/input";
import { FileUploader } from "./file-uploader";
import { WcaMonochrome } from "@workspace/icons";

export function CertificateManager({
  competition,
  persons,
}: {
  competition: Competition;
  persons: Person[];
}) {
  const [activeTab, setActiveTab] = useState<"podium" | "participation">(
    "podium",
  );
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const [selectedPodiums, setSelectedPodiums] = useState<PodiumData[]>([]);
  const [selectedParticipants, setSelctedParticipants] = useState<
    ParticipantData[]
  >([]);

  const [content, setContent] = useState<JSONContent>(podium);
  const [participantsContent, setParticipantsContent] =
    useState<JSONContent>(participation);

  const [pageMargins, setPageMargins] = useState<Margins>([40, 60, 40, 60]);
  const [pageMarginsParticipants, setPageMarginsParticipants] =
    useState<Margins>([40, 60, 40, 60]);

  const [pageOrientation, setPageOrientation] =
    useState<PageOrientation>("landscape");
  const [pageOrientationParticipants, setPageOrientationParticipants] =
    useState<PageOrientation>("portrait");

  const [pageSize, setPageSize] = useState<PageSize>("LETTER");
  const [pageSizeParticipants, setPageSizeParticipants] =
    useState<PageSize>("LETTER");

  const [files, setFiles] = useState<File[]>([]);
  const [filesParticipants, setFilesParticipants] = useState<File[]>([]);

  const [background, setBackground] = useState<string>();
  const [backgroundParticipants, setBackgroundParticipants] =
    useState<string>();

  const [selectedTemplate, setSelectedTemplate] = useState("general");
  const [searchParticipant, setSearchParticipant] = useState("");

  useEffect(() => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackground(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]!);
    } else {
      setBackground(undefined);
    }
  }, [files]);

  useEffect(() => {
    if (filesParticipants.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundParticipants(e.target?.result as string);
      };
      reader.readAsDataURL(filesParticipants[0]!);
    } else {
      setBackgroundParticipants(undefined);
    }
  }, [filesParticipants]);

  const {
    data: participantsData,
    isLoading: isLoadingParticipants,
    mutate: mutateParticipants,
  } = useSWR<ParticipantData[]>(
    `/api/certificate/participation?competitionId=${competition.id}`,
    fetcher,
    {
      fallbackData: [],
    },
  );

  const {
    data: podiumsData,
    isLoading: isLoadingPodiums,
    mutate: mutatePodiums,
  } = useSWR<PodiumData[]>(
    `/api/certificate/podium?competitionId=${competition.id}`,
    fetcher,
    {
      fallbackData: [],
    },
  );

  if (isLoadingParticipants || isLoadingPodiums) {
    return <CertificateManagerSkeleton />;
  }

  if (!competition) {
    notFound();
  }

  const [startYear, startMonth, startDay] = competition.start_date
    .split("-")
    .map(Number);
  const startDate = new Date(startYear!, startMonth! - 1, startDay);

  const [endYear, endMonth, endDay] = competition.end_date
    .split("-")
    .map(Number);
  const endDate = new Date(endYear!, endMonth! - 1, endDay);

  const isSameDay = startDate.toDateString() === endDate.toDateString();
  const formattedDate = isSameDay
    ? format(startDate, "d 'de' MMMM 'de' yyyy", { locale: es })
    : `${format(startDate, "d 'de' MMM", { locale: es })} - ${format(endDate, "d 'de' MMM 'de' yyyy", { locale: es })}`;

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
                return textObject(
                  transformString(
                    joinPersons(competition.delegates.flatMap((d) => d.name)),
                    transform,
                  ),
                );
              case "Organizadores":
                return textObject(
                  transformString(
                    joinPersons(competition.organizers.flatMap((o) => o.name)),
                    transform,
                  ),
                );
              case "Posición (cardinal)":
                return textObject(
                  transformString(
                    formatPlace(data.place, "cardinal"),
                    transform,
                  ),
                );
              case "Posición (ordinal)":
                return textObject(
                  transformString(
                    formatPlace(data.place, "ordinal"),
                    transform,
                  ),
                );
              case "Posición (ordinal con texto)":
                return textObject(
                  transformString(
                    formatPlace(data.place, "ordinal_text"),
                    transform,
                  ),
                );
              case "Medalla":
                return textObject(
                  transformString(formatPlace(data.place, "medal"), transform),
                );
              case "Competidor":
                return textObject(transformString(data.name, transform));
              case "Evento":
                return textObject(
                  transformString(formatEvents(data.event), transform),
                );
              case "Resultado":
                return textObject(
                  transformString(
                    formatResults(data.result, data.event),
                    transform,
                  ),
                );
              case "Tipo de resultado":
                return textObject(
                  transformString(formatResultType(data.event), transform),
                );
              case "Competencia":
                return textObject(transformString(competition.name, transform));
              case "Fecha":
                return textObject(
                  transformString(formatDates(startDate, endDate), transform),
                );
              case "Ciudad":
                return textObject(transformString(competition.city, transform));
              default:
                return null;
            }
          default:
            return null;
        }
      })
      .filter(Boolean);
  };

  const renderParticipantTextContent = (
    content: JSONContent["content"],
    data: ParticipantData,
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
                return textObject(
                  transformString(
                    joinPersons(competition.delegates.flatMap((d) => d.name)),
                    transform,
                  ),
                );
              case "Organizadores":
                return textObject(
                  transformString(
                    joinPersons(competition.organizers.flatMap((o) => o.name)),
                    transform,
                  ),
                );
              case "Competidor":
                return textObject(transformString(data.name, transform));
              case "Competencia":
                return textObject(transformString(competition.name, transform));
              case "Fecha":
                return textObject(
                  transformString(formatDates(startDate, endDate), transform),
                );
              case "Ciudad":
                return textObject(transformString(competition.city, transform));
              default:
                return null;
            }
          default:
            return null;
        }
      })
      .filter(Boolean);
  };

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

  const renderParticipantDocumentContent = (
    content: JSONContent,
    data: ParticipantData,
  ): unknown => {
    return content.content
      ?.map((item) => {
        const text =
          item.content && item.content.length > 0
            ? renderParticipantTextContent(item.content, data)
            : "\u00A0";
        const alignment = item.attrs?.textAlign || "left";
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
          case "table":
            return {
              columns: [
                { width: "*", text: "" },
                {
                  table: {
                    headerRows: 1,
                    // widths: item.attrs?.widths,
                    body: [
                      ...(item.content || [])
                        .map((row) => {
                          const headerCells =
                            row.content?.filter(
                              (cell) => cell.type === "tableHeader",
                            ) || [];
                          if (row.type === "tableRow") {
                            if (headerCells.length === 0) {
                              return null;
                            }
                            return headerCells.map((cell) =>
                              cell.content?.map((contentCell) =>
                                renderParticipantDocumentContent(
                                  { content: [contentCell] },
                                  data,
                                ),
                              ),
                            );
                          }
                          return null;
                        })
                        .filter(Boolean),
                      ...(item.content?.some((row) =>
                        row.content?.some((cell) => cell.type === "tableCell"),
                      )
                        ? data.results.map((result) => {
                            const cell = item.content?.find((row) =>
                              row.content?.some(
                                (cell) => cell.type === "tableCell",
                              ),
                            );

                            let event;
                            let average;
                            let ranking;

                            for (const row of cell?.content || []) {
                              for (const cell of row.content || []) {
                                if (
                                  cell.content?.some(
                                    (content) => content.type === "mention",
                                  )
                                ) {
                                  switch (cell.content[0]?.attrs?.id) {
                                    case "Evento (tabla)":
                                    case "Event (table)":
                                      event = renderParticipantDocumentContent(
                                        {
                                          content: [
                                            {
                                              type: "paragraph",
                                              attrs: cell.attrs,
                                              content: [
                                                {
                                                  type: "text",
                                                  text: formatEvents(
                                                    result.event,
                                                  ),
                                                  marks: cell.content[0].marks,
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                        data,
                                      );
                                      break;
                                    case "Resultado (tabla)":
                                    case "Result (table)":
                                      average =
                                        renderParticipantDocumentContent(
                                          {
                                            content: [
                                              {
                                                type: "paragraph",
                                                attrs: cell.attrs,
                                                content: [
                                                  {
                                                    type: "text",
                                                    text: formatResults(
                                                      result.average,
                                                      result.event,
                                                    ),
                                                    marks:
                                                      cell.content[0].marks,
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          data,
                                        );
                                      break;
                                    case "Posición (tabla)":
                                    case "Ranking (table)":
                                      ranking =
                                        renderParticipantDocumentContent(
                                          {
                                            content: [
                                              {
                                                type: "paragraph",
                                                attrs: cell.attrs,
                                                content: [
                                                  {
                                                    type: "text",
                                                    text: (
                                                      result.ranking || ""
                                                    ).toString(),
                                                    marks:
                                                      cell.content[0].marks,
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          data,
                                        );
                                      break;
                                    default:
                                      break;
                                  }
                                }
                              }
                            }

                            return [event || {}, average || {}, ranking || {}];
                          })
                        : []),
                    ],
                  },
                  layout: "lightHorizontalLines",
                  width: "auto",
                },
                { width: "*", text: "" },
              ],
            };
          default:
            return null;
        }
      })
      .filter(Boolean);
  };

  const generatePDF = () => {
    const docDefinition = {
      info: {
        title: `Certificados - ${competition.name}`,
        author: "Cubing México",
      },
      content: selectedPodiums?.map((data, index) => ({
        stack: renderDocumentContent(content, data),
        pageBreak: index < selectedPodiums.length - 1 ? "after" : "",
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

  const generateParticipantPDF = () => {
    const docDefinition = {
      info: {
        title: `Certificados - ${competition.name}`,
        author: "Cubing México",
      },
      content: selectedParticipants?.map((data, index) => ({
        stack: renderParticipantDocumentContent(participantsContent, data),
        pageBreak: index < selectedParticipants.length - 1 ? "after" : "",
      })),
      background(currentPage, pageSize) {
        if (backgroundParticipants) {
          return {
            image: backgroundParticipants,
            width: pageSize.width,
            height: pageSize.height,
          };
        }
        return null;
      },
      pageMargins: pageMarginsParticipants,
      pageOrientation: pageOrientationParticipants,
      pageSize: pageSizeParticipants,
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

  const eventNames: Record<string, string> = {
    "333": "Cubo 3x3x3",
    "222": "Cubo 2x2x2",
    "444": "Cubo 4x4x4",
    "555": "Cubo 5x5x5",
    "666": "Cubo 6x6x6",
    "777": "Cubo 7x7x7",
    "333bf": "3x3x3 Blindfolded",
    "333fm": "3x3x3 Fewest Moves",
    "333oh": "3x3x3 One-Handed",
    clock: "Clock",
    minx: "Megaminx",
    pyram: "Pyraminx",
    skewb: "Skewb",
    sq1: "Square-1",
    "444bf": "4x4x4 Blindfolded",
    "555bf": "5x5x5 Blindfolded",
    "333mbf": "3x3x3 Multi-Blind",
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchParticipant.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Competencias</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink className="max-w-[200px] truncate">
              {competition.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>Certificados</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Certificados: {competition.name}
        </h1>
        <p className="text-muted-foreground">
          Gestiona los certificados de podio y participación para esta
          competencia.
        </p>
      </div>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Competencia</CardTitle>
              <CardDescription>Detalles sobre la competencia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <Link
                  href={`https://live.worldcubeassociation.org/link/competitions/${competition.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
                >
                  <WcaMonochrome />
                  WCA Live
                </Link>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">
                  {competition.city}, {competition.country_iso2}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">{formattedDate}</span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">
                  {competition.competitor_limit} competidores
                </span>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  Eventos ({competition.event_ids.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {competition.event_ids.map((eventId) => (
                    <span
                      className={`cubing-icon event-${eventId}`}
                      key={eventId}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Estado de los Certificados</CardTitle>
              <CardDescription>
                Información sobre los certificados generados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      Certificados de Podio
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {Math.ceil((podiumsData?.length ?? 0) / 3)} generados
                    </span>
                  </div>
                  <Progress
                    value={
                      podiumsData
                        ? (Math.ceil(podiumsData.length / 3) /
                            competition.event_ids.length) *
                          100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      Certificados de Participación
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {participantsData?.length || 0} generados
                    </span>
                  </div>
                  <Progress
                    value={
                      participantsData
                        ? (participantsData.length /
                            competition.competitor_limit) *
                          100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              </div>
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">
                      Última actualización
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDistance(lastUpdate, new Date(), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                  <Button
                    disabled={isLoadingParticipants || isLoadingPodiums}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void mutateParticipants();
                      void mutatePodiums();
                      setLastUpdate(new Date());
                    }}
                  >
                    <RefreshCw />
                    Actualizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "podium" | "participation")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="podium">
              <Award className="size-4 mr-2" />
              Certificados de Podio
            </TabsTrigger>
            <TabsTrigger value="participation">
              <FileText className="size-4 mr-2" />
              Certificados de Participación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="podium" className="space-y-6 pt-6">
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Configuración
                    </CardTitle>
                    <CardDescription>
                      Selecciona los eventos para los que se generarán los
                      certificados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="podiumType">Tipo de podio</Label>
                      <Select
                        disabled
                        value={selectedTemplate}
                        onValueChange={handleTemplateChange}
                      >
                        <SelectTrigger className="w-[180px]" id="podiumType">
                          <SelectValue placeholder="Seleccionar tipo de podio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="female">Femeniles</SelectItem>
                          <SelectItem value="newcomers">Primera vez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Eventos</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {competition.event_ids.map((eventId) => (
                          <div
                            key={eventId}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`event-${eventId}`}
                              checked={
                                selectedPodiums.filter(
                                  (podium) => podium.event === eventId,
                                ).length > 0
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const podium = podiumsData?.filter(
                                    (podium) => podium.event === eventId,
                                  );
                                  if (podium) {
                                    setSelectedPodiums((prev) => [
                                      ...prev,
                                      ...podium,
                                    ]);
                                  }
                                } else {
                                  setSelectedPodiums((prev) =>
                                    prev.filter(
                                      (podium) => podium.event !== eventId,
                                    ),
                                  );
                                }
                              }}
                              disabled={
                                podiumsData?.filter(
                                  (podium) => podium.event === eventId,
                                ).length === 0
                              }
                            />
                            <Label
                              htmlFor={`event-${eventId}`}
                              className="flex gap-1 items-center"
                            >
                              <span
                                className={`cubing-icon event-${eventId}`}
                              />{" "}
                              <p className="text-xs">
                                {eventNames[eventId] || eventId}
                              </p>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Toggle
                      aria-label="Seleccionar todos"
                      onClick={() => {
                        if (selectedPodiums.length === podiumsData?.length) {
                          setSelectedPodiums([]);
                        } else {
                          setSelectedPodiums(podiumsData || []);
                        }
                      }}
                      pressed={
                        selectedPodiums.length === podiumsData?.length
                          ? true
                          : false
                      }
                    >
                      <Check />
                      {selectedPodiums.length === podiumsData?.length
                        ? "Desmarcar todos"
                        : "Seleccionar todos"}
                    </Toggle>
                    <Button
                      disabled={selectedPodiums.length === 0}
                      onClick={generatePDF}
                      variant="outline"
                    >
                      <Eye />
                      Vista previa ({Math.ceil(selectedPodiums.length / 3)})
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fondo</CardTitle>
                    <CardDescription>
                      Personaliza el fondo del certificado de podio
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileUploader files={files} setFiles={setFiles} />
                  </CardContent>
                </Card>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <Tiptap
                  competitionId={competition.id}
                  content={content}
                  key={`${pageSize}-${pageOrientation}-${pageMargins}`}
                  onChange={(newContent: JSONContent) => {
                    setContent(newContent);
                  }}
                  pageMargins={pageMargins}
                  pageOrientation={pageOrientation}
                  pageSize={pageSize}
                  pdfDisabled={selectedPodiums.length === 0}
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
            </div>
          </TabsContent>

          <TabsContent value="participation" className="space-y-6 pt-6">
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Configuración
                    </CardTitle>
                    <CardDescription>
                      Selecciona los participantes para los que se generarán los
                      certificados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Buscar participante"
                      value={searchParticipant}
                      onChange={(e) => {
                        setSearchParticipant(e.target.value);
                      }}
                    />
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Participantes</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredPersons.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No se encontraron participantes
                          </p>
                        ) : (
                          <>
                            {filteredPersons.map((person) => (
                              <div
                                key={person.wcaId || person.name}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={person.wcaId || person.name}
                                  checked={
                                    selectedParticipants.filter(
                                      (participant) =>
                                        participant.wcaId === person.wcaId,
                                    ).length > 0
                                  }
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      const participant =
                                        participantsData?.filter(
                                          (participant) =>
                                            participant.wcaId === person.wcaId,
                                        );
                                      if (participant) {
                                        setSelctedParticipants((prev) => [
                                          ...prev,
                                          ...participant,
                                        ]);
                                      }
                                    } else {
                                      setSelctedParticipants((prev) =>
                                        prev.filter(
                                          (participant) =>
                                            participant.wcaId !== person.wcaId,
                                        ),
                                      );
                                    }
                                  }}
                                  disabled={
                                    participantsData?.filter(
                                      (participant) =>
                                        participant.wcaId === person.wcaId,
                                    ).length === 0
                                  }
                                />
                                <Label htmlFor={person.wcaId || person.name}>
                                  <p className="text-xs">{person.name}</p>
                                </Label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Toggle
                      aria-label="Seleccionar todos"
                      onClick={() => {
                        if (
                          selectedParticipants.length ===
                          participantsData?.length
                        ) {
                          setSelctedParticipants([]);
                        } else {
                          setSelctedParticipants(participantsData || []);
                        }
                      }}
                      pressed={
                        selectedParticipants.length === participantsData?.length
                          ? true
                          : false
                      }
                    >
                      <Check />
                      {selectedParticipants.length === participantsData?.length
                        ? "Desmarcar todos"
                        : "Seleccionar todos"}
                    </Toggle>
                    <Button
                      disabled={selectedParticipants.length === 0}
                      variant="outline"
                      onClick={generateParticipantPDF}
                    >
                      <Eye />
                      Vista previa ({selectedParticipants.length})
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fondo</CardTitle>
                    <CardDescription>
                      Personaliza el fondo del certificado de participación
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileUploader
                      files={filesParticipants}
                      setFiles={setFilesParticipants}
                    />
                  </CardContent>
                </Card>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <Tiptap
                  competitionId={competition.id}
                  content={participantsContent}
                  key={`${pageSizeParticipants}-${pageOrientationParticipants}-${pageMarginsParticipants}`}
                  onChange={(newContent: JSONContent) => {
                    setParticipantsContent(newContent);
                  }}
                  pageMargins={pageMarginsParticipants}
                  pageOrientation={pageOrientationParticipants}
                  pageSize={pageSizeParticipants}
                  pdfDisabled={selectedParticipants.length === 0}
                  pdfOnClick={generateParticipantPDF}
                  setPageMargins={(value: Margins) => {
                    setPageMarginsParticipants(value);
                  }}
                  setPageOrientation={(value: PageOrientation) => {
                    setPageOrientationParticipants(value);
                  }}
                  setPageSize={(value: PageSize) => {
                    setPageSizeParticipants(value);
                  }}
                  variant="participation"
                />
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
