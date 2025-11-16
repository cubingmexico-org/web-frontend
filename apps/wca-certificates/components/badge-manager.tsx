"use client";

import { useEffect, useState } from "react";
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
import { fetcher } from "@/lib/utils";
import type { Person } from "@/types/wcif";
import { BadgeManagerSkeleton } from "./badge-manager-skeleton";
import { Input } from "@workspace/ui/components/input";
import { FileUploader } from "./file-uploader";
import { WcaMonochrome } from "@workspace/icons";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Canvas } from "./canvas/canvas";
import { useCanvasStore } from "@/lib/canvas-store";
import JSZip from "jszip";
import QRCode from "qrcode";

export function BadgeManager({
  competition,
  persons,
}: {
  competition: Competition;
  persons: Person[];
}) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);

  const [files, setFiles] = useState<File[]>([]);
  const [backFiles, setBackFiles] = useState<File[]>([]);

  const [search, setSearch] = useState("");

  const {
    setBackgroundImage,
    setBackgroundImageBack,
    elements,
    canvasWidth,
    canvasHeight,
    backgroundImage,
    backgroundImageBack,
    enableBackSide,
  } = useCanvasStore();

  useEffect(() => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]!);
    } else {
      setBackgroundImage(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    if (backFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImageBack(e.target?.result as string);
      };
      reader.readAsDataURL(backFiles[0]!);
    } else {
      setBackgroundImageBack(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backFiles]);

  const exportToPNG = async () => {
    // Helper function to measure text and calculate optimal font size with multi-line support
    const measureTextAndAdjustFontSize = (
      ctx: CanvasRenderingContext2D,
      text: string,
      maxWidth: number,
      maxHeight: number,
      baseFontSize: number,
      fontFamily: string,
      fontWeight: string,
    ): { fontSize: number; lines: string[] } => {
      let fontSize = baseFontSize;
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

      const splitIntoLines = (text: string, maxWidth: number): string[] => {
        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = words[0] || "";

        for (let i = 1; i < words.length; i++) {
          const word = words[i]!;
          const testLine = currentLine + " " + word;
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);
        return lines;
      };

      // Try to fit text in 2 lines maximum
      let lines = splitIntoLines(text, maxWidth);
      const lineHeight = fontSize * 1.2;
      let totalHeight = lines.length * lineHeight;

      // Reduce font size until text fits within bounds (max 2 lines)
      while ((totalHeight > maxHeight || lines.length > 2) && fontSize > 8) {
        fontSize -= 0.5;
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        lines = splitIntoLines(text, maxWidth);
        totalHeight = lines.length * fontSize * 1.2;
      }

      // If still more than 2 lines, force into 2 lines
      if (lines.length > 2) {
        const words = text.split(" ");
        const midPoint = Math.ceil(words.length / 2);
        lines = [
          words.slice(0, midPoint).join(" "),
          words.slice(midPoint).join(" "),
        ];
      }

      return { fontSize, lines };
    };

    // Shared function to draw all elements on a canvas
    const drawElements = async (
      ctx: CanvasRenderingContext2D,
      currentPerson: Person,
      side: "front" | "back" = "front",
    ) => {
      for (const element of elements[side]) {
        ctx.save();

        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((element.rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);

        switch (element.type) {
          case "rectangle":
            ctx.fillStyle = element.backgroundColor || "#3b82f6";
            ctx.fillRect(element.x, element.y, element.width, element.height);
            break;
          case "circle":
            ctx.fillStyle = element.backgroundColor || "#8b5cf6";
            ctx.beginPath();
            ctx.arc(
              element.x + element.width / 2,
              element.y + element.height / 2,
              element.width / 2,
              0,
              2 * Math.PI,
            );
            ctx.fill();
            break;
          case "text": {
            const baseFontSize = element.fontSize || 24;
            const fontFamily = element.fontFamily || "sans-serif";
            const fontWeight = element.fontWeight || "normal";

            // Replace placeholder text with person's data
            let content = element.content || "Text";
            content = content.replace(/@nombre/gi, currentPerson.name);
            content = content.replace(
              /@wcaid/gi,
              currentPerson.wcaId || "Nuevo",
            );

            const rol = currentPerson.roles.includes("delegate")
              ? "Delegado"
              : currentPerson.roles.includes("organizer")
                ? "Organizador"
                : currentPerson.roles.find((r) => r.startsWith("staff-"))
                  ? "Staff"
                  : "Competidor";

            content = content.replace(/@rol/gi, rol);

            // Calculate optimal font size and split into lines
            const { fontSize: optimalFontSize, lines } =
              measureTextAndAdjustFontSize(
                ctx,
                content,
                element.width,
                element.height,
                baseFontSize,
                fontFamily,
                fontWeight,
              );

            ctx.fillStyle = element.color || "#000000";
            ctx.font = `${fontWeight} ${optimalFontSize}px ${fontFamily}`;
            ctx.textAlign = element.textAlign || "left";

            const lineHeight = optimalFontSize * 1.2;
            const totalTextHeight = lines.length * lineHeight;
            const startY =
              element.y +
              (element.height - totalTextHeight) / 2 +
              optimalFontSize;

            // Draw each line
            lines.forEach((line, index) => {
              let textX = element.x;
              if (element.textAlign === "center") {
                textX = element.x + element.width / 2;
              } else if (element.textAlign === "right") {
                textX = element.x + element.width;
              }

              ctx.fillText(line, textX, startY + index * lineHeight);
            });

            ctx.textAlign = "left";
            break;
          }
          case "image":
            if (element.imageUrl) {
              const img = new Image();

              const isWcaAvatar = element.imageUrl === "/avatar.png";
              const imageUrl =
                isWcaAvatar && currentPerson.avatar
                  ? `/api/image-proxy?url=${encodeURIComponent(currentPerson.avatar.url)}`
                  : element.imageUrl;

              if (imageUrl.startsWith("http")) {
                img.crossOrigin = "anonymous";
              }

              await new Promise<void>((resolve) => {
                img.onload = () => {
                  ctx.drawImage(
                    img,
                    element.x,
                    element.y,
                    element.width,
                    element.height,
                  );
                  resolve();
                };
                img.onerror = (error) => {
                  console.error("Failed to load image:", imageUrl, error);
                  resolve();
                };
                img.src = imageUrl;
              });
            }
            break;
          case "qrcode": {
            // Replace placeholder text with person's data
            const qrData =
              element.qrDataSource === "wca-live"
                ? `https://live.worldcubeassociation.org/link/competitions/${competition.id}`
                : element.qrDataSource === "competition-groups"
                  ? `https://www.competitiongroups.com/competitions/${competition.id}/persons/${currentPerson.registrantId}`
                  : element.qrData;

            if (qrData) {
              try {
                // Generate QR code as data URL
                const qrDataUrl = await QRCode.toDataURL(qrData, {
                  errorCorrectionLevel: element.qrErrorCorrection || "M",
                  margin: 1,
                  width: element.width,
                  color: {
                    dark: element.qrForeground || "#000000",
                    light: element.qrBackground || "#ffffff",
                  },
                });

                // Draw QR code
                const qrImg = new Image();
                await new Promise<void>((resolve) => {
                  qrImg.onload = () => {
                    ctx.drawImage(
                      qrImg,
                      element.x,
                      element.y,
                      element.width,
                      element.height,
                    );
                    resolve();
                  };
                  qrImg.onerror = () => {
                    console.error("Failed to load QR code");
                    resolve();
                  };
                  qrImg.src = qrDataUrl;
                });
              } catch (error) {
                console.error("Failed to generate QR code:", error);
              }
            }
            break;
          }
        }

        ctx.restore();
      }
    };

    // Shared function to create and process canvas
    const createAndProcessCanvas = (
      person: Person,
      side: "front" | "back",
      onComplete: (canvas: HTMLCanvasElement) => void,
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const processCanvas = async () => {
        await drawElements(ctx, person, side);
        onComplete(canvas);
      };

      if (backgroundImage && side === "front") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = backgroundImage;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          void processCanvas();
        };
      } else if (backgroundImageBack && side === "back") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = backgroundImageBack;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          void processCanvas();
        };
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        void processCanvas();
      }
    };

    // Single badge export
    if (selectedPersons.length === 1) {
      const person = selectedPersons[0]!;

      // Export front side
      createAndProcessCanvas(person, "front", (canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${person.name.replace(/\s/g, "_")}_badge_front.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        });
      });

      // Export back side if enabled
      if (enableBackSide) {
        createAndProcessCanvas(person, "back", (canvas) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${person.name.replace(/\s/g, "_")}_badge_back.png`;
              a.click();
              URL.revokeObjectURL(url);
            }
          });
        });
      }
      return;
    }

    // Multiple badges export
    const zip = new JSZip();

    const promises = selectedPersons.flatMap((person) => {
      const frontPromise = new Promise<void>((resolve) => {
        createAndProcessCanvas(person, "front", (canvas) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const filename = `${person.name.replace(/\s/g, "_")}_badge_front.png`;
              zip.file(filename, blob);
            }
            resolve();
          });
        });
      });

      if (enableBackSide) {
        const backPromise = new Promise<void>((resolve) => {
          createAndProcessCanvas(person, "back", (canvas) => {
            canvas.toBlob((blob) => {
              if (blob) {
                const filename = `${person.name.replace(/\s/g, "_")}_badge_back.png`;
                zip.file(filename, blob);
              }
              resolve();
            });
          });
        });
        return [frontPromise, backPromise];
      }

      return [frontPromise];
    });

    // Wait for all badges to be processed
    await Promise.all(promises);

    // Generate and download the ZIP file
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${competition.name.replace(/\s/g, "_")}_badges.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { data, isLoading, mutate } = useSWR<Person[]>(
    `/api/badges?competitionId=${competition.id}`,
    fetcher,
    {
      fallbackData: [],
    },
  );

  if (isLoading) {
    return <BadgeManagerSkeleton />;
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
          Gestiona los gafetes para esta competencia.
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
                    Gafetes de Participantes
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {data?.length || 0} de {persons.length} generados
                  </span>
                </div>
                <Progress
                  value={data ? (data.length / persons.length) * 100 : 0}
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
                                    const participant = data?.filter(
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
                    disabled={selectedPersons.length === data?.length}
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
                    onClick={exportToPNG}
                  >
                    <Download />
                    Descargar ({selectedPersons.length})
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {enableBackSide ? "Fondos del Gafete" : "Fondo del Gafete"}
                </CardTitle>
                <CardDescription>
                  {enableBackSide
                    ? "Sube las imágenes de fondo para el anverso y reverso del gafete."
                    : "Sube una imagen de fondo para el gafete."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {enableBackSide && <Label>Fondo Anverso</Label>}
                <FileUploader files={files} setFiles={setFiles} />
                {enableBackSide && (
                  <>
                    <Label>Fondo Reverso</Label>
                    <FileUploader files={backFiles} setFiles={setBackFiles} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Canvas />
        </div>
      </div>
    </div>
  );
}
