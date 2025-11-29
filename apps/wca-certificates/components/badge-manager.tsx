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
  Loader2,
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
import { notFound } from "next/navigation";
import type { ExtendedPerson } from "@/types/wcif";
import { Input } from "@workspace/ui/components/input";
import { FileUploader } from "./file-uploader";
import { WcaMonochrome } from "@workspace/icons";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Canvas } from "./canvas/canvas";
import { useCanvasStore } from "@/lib/canvas-store";
import JSZip from "jszip";
import QRCode from "qrcode";
import type { State, Team } from "@/db/queries";
import { toast } from "sonner";
import { revalidateWCIF } from "@/app/actions";
import { Switch } from "@workspace/ui/components/switch";

interface BadgeManagerProps {
  competition: Competition;
  persons: ExtendedPerson[];
  states: State[];
  teams: Team[];
}

export function BadgeManager({
  competition,
  persons,
  states,
  teams,
}: BadgeManagerProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const [selectedPersons, setSelectedPersons] = useState<ExtendedPerson[]>([]);

  const [files, setFiles] = useState<File[]>([]);
  const [backFiles, setBackFiles] = useState<File[]>([]);

  const [search, setSearch] = useState("");

  const [showOnlyCompeting, setShowOnlyCompeting] = useState<boolean>(false);

  const [isExporting, setIsExporting] = useState(false);

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
    setIsExporting(true);

    // Wrap the entire export logic in toast.promise
    toast.promise(
      (async () => {
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
          while (
            (totalHeight > maxHeight || lines.length > 2) &&
            fontSize > 8
          ) {
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
          currentPerson: ExtendedPerson,
          side: "front" | "back" = "front",
        ) => {
          for (const element of elements[side]) {
            ctx.save();

            const centerX = element.x + element.width / 2;
            const centerY = element.y + element.height / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate((element.rotation * Math.PI) / 180);
            ctx.translate(-centerX, -centerY);
            ctx.globalAlpha =
              element.opacity !== undefined ? element.opacity : 1;

            switch (element.type) {
              case "rectangle":
                ctx.fillStyle = element.backgroundColor || "#3b82f6";
                ctx.fillRect(
                  element.x,
                  element.y,
                  element.width,
                  element.height,
                );
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
                let content = element.content || "";
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

                content = content.replace(
                  /@id/gi,
                  String(currentPerson.registrantId) || "Desconocido",
                );

                const regionNames = new Intl.DisplayNames(["es"], {
                  type: "region",
                });
                const countryName =
                  regionNames.of(currentPerson.countryIso2) || "Desconocido";

                content = content.replace(/@país/gi, countryName);

                content = content.replace(/@país/gi, countryName);

                const stateName = states.find(
                  (s) => s.id === currentPerson.stateId,
                )?.name;

                content = content.replace(
                  /@estado/gi,
                  stateName || "Desconocido",
                );

                const teamName = teams.find(
                  (t) => t.stateId === currentPerson.stateId,
                )?.name;

                content = content.replace(/@team/gi, teamName || "Desconocido");

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

                // Apply drop shadow if enabled
                if (element.dropShadow?.enabled) {
                  ctx.shadowColor = element.dropShadow.color || "#000000";
                  ctx.shadowBlur = element.dropShadow.blur || 4;
                  ctx.shadowOffsetX = element.dropShadow.offsetX || 2;
                  ctx.shadowOffsetY = element.dropShadow.offsetY || 2;
                }

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

                // Reset shadow after drawing text
                if (element.dropShadow?.enabled) {
                  ctx.shadowColor = "transparent";
                  ctx.shadowBlur = 0;
                  ctx.shadowOffsetX = 0;
                  ctx.shadowOffsetY = 0;
                }

                ctx.textAlign = "left";
                break;
              }
              case "image":
                if (element.imageUrl) {
                  const img = new Image();

                  const isWcaAvatar = element.imageUrl === "/avatar.png";
                  const isTeamLogo = element.imageUrl === "/team-logo.svg";
                  const isCountryFlag = element.imageUrl === "/country.svg";
                  const isEventsIcon = element.imageUrl === "/events.svg";

                  const teamImage = teams.find(
                    (t) => t.stateId === currentPerson.stateId,
                  )?.image;

                  if (isEventsIcon) {
                    const eventsOrdered = competition.event_ids;

                    // Get person's event IDs
                    const personEventIds =
                      currentPerson.registration?.eventIds || [];

                    if (personEventIds.length > 0) {
                      // Sort person's events according to eventsOrdered
                      const sortedEventIds = personEventIds.sort((a, b) => {
                        const indexA = eventsOrdered.indexOf(a);
                        const indexB = eventsOrdered.indexOf(b);
                        return indexA - indexB;
                      });

                      const spacing = 5;
                      const iconSize = element.height;
                      const totalWidth =
                        iconSize * sortedEventIds.length +
                        spacing * (sortedEventIds.length - 1);

                      // Calculate starting X position to center the icons
                      const startX =
                        element.x + (element.width - totalWidth) / 2;

                      // Load and draw each event icon
                      const eventPromises = sortedEventIds.map(
                        (eventId, index) => {
                          return new Promise((resolveEvent) => {
                            const eventImg = new Image();
                            eventImg.crossOrigin = "anonymous";

                            eventImg.onload = () => {
                              const xPos =
                                startX + (iconSize + spacing) * index;

                              const tempCanvas =
                                document.createElement("canvas");
                              tempCanvas.width = iconSize;
                              tempCanvas.height = iconSize;
                              const tempCtx = tempCanvas.getContext("2d");

                              tempCtx?.drawImage(
                                eventImg,
                                0,
                                0,
                                iconSize,
                                iconSize,
                              );

                              tempCtx!.globalCompositeOperation = "source-in";
                              tempCtx!.fillStyle = element.color || "#000000";
                              tempCtx!.fillRect(0, 0, iconSize, iconSize);

                              ctx.drawImage(
                                tempCanvas,
                                xPos,
                                element.y,
                                iconSize,
                                iconSize,
                              );

                              resolveEvent(void 0);
                            };

                            eventImg.onerror = () => {
                              console.error(
                                `Failed to load event icon: ${eventId}`,
                              );
                              resolveEvent(void 0);
                            };

                            eventImg.src = `/events/${eventId}.svg`;
                          });
                        },
                      );

                      await Promise.all(eventPromises);
                    }
                    break;
                  }

                  const imageUrl =
                    isWcaAvatar && currentPerson.avatar
                      ? `/api/image-proxy?url=${encodeURIComponent(currentPerson.avatar.url)}`
                      : isTeamLogo
                        ? teamImage || "/logo.svg"
                        : isCountryFlag
                          ? `https://flagcdn.com/h240/${currentPerson.countryIso2.toLowerCase()}.png`
                          : element.imageUrl;

                  if (imageUrl.startsWith("http")) {
                    img.crossOrigin = "anonymous";
                  }

                  await new Promise<void>((resolve) => {
                    img.onload = () => {
                      // Apply border radius if specified
                      if (element.borderRadius && element.borderRadius > 0) {
                        ctx.save();
                        ctx.beginPath();

                        // For 50% border radius, draw a circle
                        if (element.borderRadius === 50) {
                          const centerX = element.x + element.width / 2;
                          const centerY = element.y + element.height / 2;
                          const radius =
                            Math.min(element.width, element.height) / 2;
                          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                        } else {
                          // For other values, draw rounded rectangle
                          // Cap the radius to prevent overlapping corners
                          const maxRadius =
                            Math.min(element.width, element.height) / 2;
                          const radius = Math.min(
                            (element.borderRadius / 100) * maxRadius * 2,
                            maxRadius,
                          );

                          ctx.moveTo(element.x + radius, element.y);
                          ctx.lineTo(
                            element.x + element.width - radius,
                            element.y,
                          );
                          ctx.quadraticCurveTo(
                            element.x + element.width,
                            element.y,
                            element.x + element.width,
                            element.y + radius,
                          );
                          ctx.lineTo(
                            element.x + element.width,
                            element.y + element.height - radius,
                          );
                          ctx.quadraticCurveTo(
                            element.x + element.width,
                            element.y + element.height,
                            element.x + element.width - radius,
                            element.y + element.height,
                          );
                          ctx.lineTo(
                            element.x + radius,
                            element.y + element.height,
                          );
                          ctx.quadraticCurveTo(
                            element.x,
                            element.y + element.height,
                            element.x,
                            element.y + element.height - radius,
                          );
                          ctx.lineTo(element.x, element.y + radius);
                          ctx.quadraticCurveTo(
                            element.x,
                            element.y,
                            element.x + radius,
                            element.y,
                          );
                        }

                        ctx.closePath();
                        ctx.clip();
                      }

                      if (element.keepAspectRatio) {
                        // Calculate dimensions for 1:1 crop
                        const size = Math.min(img.width, img.height);
                        const sx = (img.width - size) / 2;
                        const sy = (img.height - size) / 2;

                        // Draw cropped image to 1:1 aspect ratio
                        ctx.drawImage(
                          img,
                          sx,
                          sy,
                          size,
                          size,
                          element.x,
                          element.y,
                          element.width,
                          element.height,
                        );
                      } else {
                        // Draw image normally, stretching to fit
                        ctx.drawImage(
                          img,
                          element.x,
                          element.y,
                          element.width,
                          element.height,
                        );
                      }

                      if (element.borderRadius && element.borderRadius > 0) {
                        ctx.restore();
                      }

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
          person: ExtendedPerson,
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
      })().finally(() => {
        setIsExporting(false);
      }),
      {
        loading: `Generando ${selectedPersons.length === 1 ? "gafete" : `${selectedPersons.length} gafetes`}...`,
        success: `${selectedPersons.length === 1 ? "Gafete generado" : `${selectedPersons.length} gafetes generados`} exitosamente`,
        error: "Error al generar los gafetes",
      },
    );
  };

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
    .filter(
      (person) =>
        removeAccents(person.name.toLowerCase()).includes(
          removeAccents(search.toLowerCase()),
        ) &&
        // optional competing-only filter
        (!showOnlyCompeting || person.registration?.isCompeting === true),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const groupedPersons = (() => {
    const newcomers: ExtendedPerson[] = [];
    const delegates: ExtendedPerson[] = [];
    const organizers: ExtendedPerson[] = [];
    const regulars: ExtendedPerson[] = [];

    for (const p of filteredPersons) {
      // prioritize delegate over organizer
      const isDelegate = p.roles?.includes("delegate");
      const isOrganizer = p.roles?.includes("organizer");

      if (isDelegate) {
        delegates.push(p);
      } else if (isOrganizer) {
        organizers.push(p);
      } else if (!p.wcaId) {
        newcomers.push(p);
        continue;
      } else {
        regulars.push(p);
      }
    }

    return { newcomers, delegates, organizers, regulars };
  })();

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
                    {persons.length} generados
                  </span>
                </div>
                <Progress value={100} className="h-2" />
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
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      revalidateWCIF(competition.id);
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
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Participantes</h4>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="show-only-competing" className="text-xs">
                        Mostrar solo competidores
                      </Label>
                      <Switch
                        id="show-only-competing"
                        checked={showOnlyCompeting}
                        onCheckedChange={(v) =>
                          setShowOnlyCompeting(Boolean(v))
                        }
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-96" type="always">
                    <div className="grid grid-cols-2 gap-2">
                      {filteredPersons.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No se encontraron participantes
                        </p>
                      ) : (
                        <>
                          {[
                            {
                              key: "delegates",
                              title: "Delegados",
                              list: groupedPersons.delegates,
                            },
                            {
                              key: "organizers",
                              title: "Organizadores",
                              list: groupedPersons.organizers,
                            },
                            {
                              key: "newcomers",
                              title: "Nuevos",
                              list: groupedPersons.newcomers,
                            },
                            {
                              key: "regulars",
                              title: "Competidores",
                              list: groupedPersons.regulars,
                            },
                          ].map(({ key, title, list }) =>
                            list.length > 0 ? (
                              <div key={key} className="col-span-2">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="text-xs font-medium">
                                    {title} ({list.length})
                                  </div>
                                  <div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedPersons((prev) => {
                                          const existingIds = new Set(
                                            prev.map((p) => p.registrantId),
                                          );
                                          const toAdd = list.filter(
                                            (p) =>
                                              !existingIds.has(p.registrantId),
                                          );
                                          return [...prev, ...toAdd];
                                        });
                                      }}
                                    >
                                      <Check />
                                      <span className="ml-1 text-xs">
                                        Seleccionar todo
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {list.map((person) => {
                                    const isChecked = selectedPersons.some(
                                      (p) => p.wcaUserId === person.wcaUserId,
                                    );
                                    return (
                                      <div
                                        key={person.wcaUserId}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox
                                          id={String(person.wcaUserId)}
                                          checked={isChecked}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              setSelectedPersons((prev) =>
                                                prev.some(
                                                  (p) =>
                                                    p.registrantId ===
                                                    person.registrantId,
                                                )
                                                  ? prev
                                                  : [...prev, person],
                                              );
                                            } else {
                                              setSelectedPersons((prev) =>
                                                prev.filter(
                                                  (p) =>
                                                    p.registrantId !==
                                                    person.registrantId,
                                                ),
                                              );
                                            }
                                          }}
                                        />
                                        <Label
                                          htmlFor={String(person.wcaUserId)}
                                        >
                                          <p className="text-xs">
                                            {person.name}
                                          </p>
                                        </Label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : null,
                          )}
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
                    disabled={selectedPersons.length === persons.length}
                    onClick={() => {
                      setSelectedPersons(persons);
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
                    disabled={selectedPersons.length === 0 || isExporting}
                    onClick={exportToPNG}
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Exportando...
                      </>
                    ) : (
                      <>
                        <Download />
                        Exportar
                      </>
                    )}
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

          <Canvas
            states={states}
            teams={teams}
            eventIds={competition.event_ids}
          />
        </div>
      </div>
    </div>
  );
}
