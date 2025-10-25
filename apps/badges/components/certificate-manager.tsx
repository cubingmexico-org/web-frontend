"use client";

import { useEffect, useRef, useState } from "react";
import { format, formatDistance } from "date-fns";
import { es } from "date-fns/locale";
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
  RefreshCw,
  Settings,
  Eye,
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  Home,
  Check,
  X,
  Download,
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
  transformString,
} from "@/lib/utils";
import type { Person } from "@/types/wcif";
import Tiptap from "./editor/tiptap";
import { badges } from "@/data/certificates";
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
import { Input } from "@workspace/ui/components/input";
import { FileUploader } from "./file-uploader";
import { WcaMonochrome } from "@workspace/icons";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { toast } from "sonner";

export function CertificateManager({
  competition,
  persons,
}: {
  competition: Competition;
  persons: Person[];
}) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const [selectedPersons, setSelectedPersons] = useState<
    Person[]
  >([]);

  const [content, setContent] =
    useState<JSONContent>(badges);

  const [pageMargins, setPageMargins] =
    useState<Margins>([20, 20, 20, 20]);

  const [pageOrientation, setPageOrientation] =
    useState<PageOrientation>("portrait");

  const [pageSize, setPageSize] =
    useState<PageSize>("LETTER");

  const [files, setFiles] = useState<File[]>([]);

  const [background, setBackground] =
    useState<string>();

  const [search, setSearch] = useState("");

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

  const {
    data,
    isLoading,
    mutate,
  } = useSWR<Person[]>(
    `/api/certificate/participation?competitionId=${competition.id}`,
    fetcher,
    {
      fallbackData: [],
    },
  );

  if (isLoading) {
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

  const badgeRef = useRef<HTMLDivElement>(null)

  const downloadPNG = async () => {
    if (!badgeRef.current) return

    // Import html2canvas dynamically
    const html2canvas = (await import("html2canvas")).default

    const canvas = await html2canvas(badgeRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      width: 400,
      height: 600,
      useCORS: true,
      allowTaint: true,
    })

    const link = document.createElement("a")
    link.download = `${selectedPersons[0]?.name.replace(/\s+/g, "_")}_badge.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const previewImage = async () => {
    if (!badgeRef.current) return

    // Import html2canvas dynamically
    const html2canvas = (await import("html2canvas")).default

    const canvas = await html2canvas(badgeRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      width: 400,
      height: 600,
      useCORS: true,
      allowTaint: true,
    })

    const dataURL = canvas.toDataURL()
    window.open(dataURL, "_blank")
  }

  const renderParticipantTextContent = (
    content: JSONContent["content"],
    data: Person,
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
              case "Nombre":
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

  const renderParticipantDocumentContent = (
    content: JSONContent,
    data: Person,
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
                        ? data.assignments.map(() => {
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

  const generateParticipantPDF = (action: "open" | "download") => {
    try {
      const docDefinition = {
        info: {
          title: `Certificados - ${competition.name}`,
          author: "Cubing México",
        },
        content: selectedPersons?.map((data, index) => ({
          stack: renderParticipantDocumentContent(content, data),
          pageBreak: index < selectedPersons.length - 1 ? "after" : "",
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
        pageMargins: pageMargins,
        pageOrientation: pageOrientation,
        pageSize: pageSize,
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

      const pdf = pdfMake.createPdf(docDefinition, undefined, fontDeclarations);
      if (action === "open") {
        pdf.open();
      } else {
        pdf.download(`Certificados Participacion - ${competition.name}.pdf`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error al generar el PDF", {
        description: "Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const removeAccents = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredPersons = persons
    .filter((person) =>
      removeAccents(person.name.toLowerCase()).includes(
        removeAccents(search.toLowerCase()),
      ),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

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
            <BreadcrumbLink>Gafetes</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Gafetes: {competition.name}
        </h1>
        <p className="text-muted-foreground">
          Gestiona los gafetes para esta
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
                  {persons.length}/{competition.competitor_limit} competidores
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
              <CardTitle>Estado de los Gafetes</CardTitle>
              <CardDescription>
                Información sobre los gafetes generados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    Certificados de Participación
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {data?.length || 0} de {persons.length}{" "}
                    generados
                  </span>
                </div>
                <Progress
                  value={
                    data
                      ? (data.length / persons.length) * 100
                      : 0
                  }
                  className="h-2"
                />
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
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void mutate();
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
                  gafetes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Buscar participante"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Participantes</h4>
                  <ScrollArea className="h-96" type="always">
                    <div className="grid grid-cols-2 gap-2">
                      {filteredPersons.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No se encontraron participantes
                        </p>
                      ) : (
                        <>
                          {filteredPersons.map((person) => (
                            <div
                              key={person.registrantId}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={String(person.registrantId)}
                                checked={
                                  selectedPersons.filter(
                                    (participant) =>
                                      participant.registrantId ===
                                      person.registrantId,
                                  ).length > 0
                                }
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    const participant =
                                      data?.filter(
                                        (participant) =>
                                          participant.registrantId ===
                                          person.registrantId,
                                      );
                                    if (participant) {
                                      setSelectedPersons((prev) => [
                                        ...prev,
                                        ...participant,
                                      ]);
                                    }
                                  } else {
                                    setSelectedPersons((prev) =>
                                      prev.filter(
                                        (participant) =>
                                          participant.registrantId !==
                                          person.registrantId,
                                      ),
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={String(person.registrantId)}>
                                <p className="text-xs">{person.name}</p>
                              </Label>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex justify-start gap-2 w-full">
                  <Button
                    aria-label="Seleccionar todos"
                    disabled={
                      selectedPersons.length === data?.length
                    }
                    onClick={() => {
                      setSelectedPersons(data || []);
                    }}
                    variant="ghost"
                  >
                    <Check />
                    Seleccionar todos
                  </Button>
                  {selectedPersons.length > 0 && (
                    <Button
                      aria-label="Borrar selección"
                      onClick={() => {
                        setSelectedPersons([]);
                      }}
                      variant="ghost"
                    >
                      <X />
                      Borrar selección
                    </Button>
                  )}
                </div>
                <div className="flex justify-end gap-2 w-full">
                  <Button
                    disabled={selectedPersons.length === 0}
                    variant="outline"
                    onClick={previewImage}
                  >
                    <Eye />
                    Vista previa ({selectedPersons.length})
                  </Button>
                  <Button
                    disabled={selectedPersons.length === 0}
                    onClick={downloadPNG}
                  >
                    <Download />
                    Descargar ({Math.ceil(selectedPersons.length / 3)})
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fondo</CardTitle>
                <CardDescription>
                  Personaliza el fondo del gafete
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUploader
                  files={files}
                  setFiles={setFiles}
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
              content={content}
              key={`${pageSize}-${pageOrientation}-${pageMargins}`}
              onChange={(newContent: JSONContent) => {
                setContent(newContent);
              }}
              pageMargins={pageMargins}
              pageOrientation={pageOrientation}
              pageSize={pageSize}
              pdfDisabled={selectedPersons.length === 0}
              pdfOnClick={() => generateParticipantPDF("download")}
              setPageMargins={(value: Margins) => {
                setPageMargins(value);
              }}
              setPageOrientation={(value: PageOrientation) => {
                setPageOrientation(value);
              }}
              setPageSize={(value: PageSize) => {
                setPageSize(value);
              }}
              background={background}
              badgeRef={badgeRef}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
