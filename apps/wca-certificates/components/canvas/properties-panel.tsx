"use client";

import { useCanvasStore } from "@/lib/canvas-store";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Slider } from "@workspace/ui/components/slider";
import { AlignCenter, AlignLeft, AlignRight, Trash2 } from "lucide-react";
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "@workspace/ui/components/color-picker";
import { FontsCombobox } from "./fonts-combobox";
import { Switch } from "@workspace/ui/components/switch";
import {
  Mention,
  MentionContent,
  MentionInput,
  MentionItem,
} from "@workspace/ui/components/mention";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { WcaMonochrome } from "@workspace/icons";

const mentions = [
  { id: "1", name: "nombre" },
  { id: "2", name: "wcaid" },
  { id: "3", name: "rol" },
];

export function PropertiesPanel() {
  const {
    elements,
    selectedElementId,
    updateElement,
    deleteElement,
    activeSide,
  } = useCanvasStore();

  // Get elements for the active side
  const currentElements = elements[activeSide] || [];
  const selectedElement = currentElements.find(
    (el) => el.id === selectedElementId,
  );

  if (!selectedElement) {
    return (
      <div className="w-100 bg-card border-l border-border p-4">
        <p className="text-sm text-muted-foreground">
          Selecciona un elemento para editar sus propiedades.
        </p>
      </div>
    );
  }

  return (
    <div className="w-100 bg-card border-l border-border p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Propiedades</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteElement(selectedElement.id)}
          title="Eliminar elemento"
        >
          <Trash2 />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Posición</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="x" className="text-xs">
                X
              </Label>
              <Input
                id="x"
                type="number"
                value={Math.round(selectedElement.x)}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    x: Number(e.target.value),
                  })
                }
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="y" className="text-xs">
                Y
              </Label>
              <Input
                id="y"
                type="number"
                value={Math.round(selectedElement.y)}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    y: Number(e.target.value),
                  })
                }
                className="h-8"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Tamaño</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width" className="text-xs">
                Ancho
              </Label>
              <Input
                id="width"
                type="number"
                value={Math.round(selectedElement.width)}
                onChange={(e) => {
                  const newWidth = Number(e.target.value);
                  const updates: Partial<typeof selectedElement> = {
                    width: newWidth,
                  };

                  // Always sync height when aspect ratio is locked for images
                  if (
                    (selectedElement.type === "image" ||
                      selectedElement.type === "qrcode") &&
                    selectedElement.keepAspectRatio
                  ) {
                    updates.height = newWidth;
                  }

                  updateElement(selectedElement.id, updates);
                }}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">
                Altura
              </Label>
              <Input
                id="height"
                type="number"
                value={Math.round(selectedElement.height)}
                onChange={(e) => {
                  const newHeight = Number(e.target.value);
                  const updates: Partial<typeof selectedElement> = {
                    height: newHeight,
                  };

                  // Always sync width when aspect ratio is locked for images
                  if (
                    (selectedElement.type === "image" ||
                      selectedElement.type === "qrcode") &&
                    selectedElement.keepAspectRatio
                  ) {
                    updates.width = newHeight;
                  }

                  updateElement(selectedElement.id, updates);
                }}
                className="h-8"
                disabled={
                  (selectedElement.type === "image" ||
                    selectedElement.type === "qrcode") &&
                  selectedElement.keepAspectRatio
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rotation" className="text-xs">
            Rotación: {selectedElement.rotation}°
          </Label>
          <Slider
            id="rotation"
            min={0}
            max={360}
            step={1}
            value={[selectedElement.rotation]}
            onValueChange={([value]) =>
              updateElement(selectedElement.id, { rotation: value })
            }
          />
        </div>

        {selectedElement.type === "text" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-xs">
                Contenido del texto
              </Label>
              <Mention
                className="w-full max-w-[400px]"
                inputValue={selectedElement.content || ""}
                onInputValueChange={(value) =>
                  updateElement(selectedElement.id, { content: value })
                }
              >
                <MentionInput
                  placeholder="Escribe @ para mencionar un dato dinámico..."
                  value={selectedElement.content || ""}
                  id="content"
                  className="h-8"
                />
                <MentionContent>
                  {mentions.map((mention) => (
                    <MentionItem
                      key={mention.id}
                      value={mention.name}
                      className="flex-col items-start gap-0.5"
                    >
                      <span className="text-sm">{mention.name}</span>
                    </MentionItem>
                  ))}
                </MentionContent>
              </Mention>
            </div>
            <div className="space-y-2">
              <FontsCombobox
                value={selectedElement.fontFamily || "Arial"}
                onValueChange={(fontFamily) => {
                  // Measure text dimensions
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.font = `${selectedElement.fontSize || 24}px ${fontFamily}`;
                    const metrics = ctx.measureText(
                      selectedElement.content || "",
                    );
                    const width = metrics.width;
                    const height = (selectedElement.fontSize || 24) * 1.2;

                    updateElement(selectedElement.id, {
                      fontFamily,
                      width,
                      height,
                    });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fontSize" className="text-xs">
                Tamaño de fuente
              </Label>
              <Input
                id="fontSize"
                type="number"
                value={Number((selectedElement.fontSize || 24).toFixed(2))}
                onChange={(e) => {
                  const fontSize = Number(e.target.value);

                  // Measure text dimensions
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.font = `${fontSize}px ${selectedElement.fontFamily || "Arial"}`;
                    const metrics = ctx.measureText(
                      selectedElement.content || "",
                    );
                    const width = metrics.width;
                    const height = fontSize * 1.2;

                    updateElement(selectedElement.id, {
                      fontSize,
                      width,
                      height,
                    });
                  }
                }}
                className="h-8"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Alineación de texto</Label>
              <div className="flex gap-1">
                <Button
                  variant={
                    selectedElement.textAlign === "left" ? "default" : "outline"
                  }
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateElement(selectedElement.id, { textAlign: "left" })
                  }
                >
                  <AlignLeft />
                </Button>
                <Button
                  variant={
                    selectedElement.textAlign === "center"
                      ? "default"
                      : "outline"
                  }
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateElement(selectedElement.id, { textAlign: "center" })
                  }
                >
                  <AlignCenter />
                </Button>
                <Button
                  variant={
                    selectedElement.textAlign === "right"
                      ? "default"
                      : "outline"
                  }
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateElement(selectedElement.id, { textAlign: "right" })
                  }
                >
                  <AlignRight />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="textColor" className="text-xs">
                Color del texto
              </Label>
              <ColorPicker
                value={selectedElement.color || "#000000"}
                onValueChange={(color) => {
                  // Only update if color actually changed
                  if (color !== selectedElement.color) {
                    updateElement(selectedElement.id, { color });
                  }
                }}
                defaultFormat="hex"
                className="w-full"
              >
                <div className="flex items-center gap-3">
                  <ColorPickerTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-3"
                    >
                      <ColorPickerSwatch className="size-4" />
                      {selectedElement.color || "#000000"}
                    </Button>
                  </ColorPickerTrigger>
                </div>
                <ColorPickerContent>
                  <ColorPickerArea />
                  <div className="flex items-center gap-2">
                    <ColorPickerEyeDropper />
                    <div className="flex flex-1 flex-col gap-2">
                      <ColorPickerHueSlider />
                      <ColorPickerAlphaSlider />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ColorPickerFormatSelect />
                    <ColorPickerInput />
                  </div>
                </ColorPickerContent>
              </ColorPicker>
            </div>
          </>
        )}

        {(selectedElement.type === "rectangle" ||
          selectedElement.type === "circle") && (
          <div className="space-y-2">
            <Label htmlFor="bgColor" className="text-xs">
              Color de relleno
            </Label>
            <Input
              id="bgColor"
              type="color"
              value={selectedElement.backgroundColor || "#3b82f6"}
              onChange={(e) =>
                updateElement(selectedElement.id, {
                  backgroundColor: e.target.value,
                })
              }
              className="h-10"
            />
          </div>
        )}

        {selectedElement.type === "image" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="borderRadius" className="text-xs">
                Radio de borde: {selectedElement.borderRadius || 0}%
              </Label>
              <Slider
                id="borderRadius"
                min={0}
                max={50}
                step={1}
                value={[selectedElement.borderRadius || 0]}
                onValueChange={([value]) =>
                  updateElement(selectedElement.id, { borderRadius: value })
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="keepAspectRatio" className="text-xs">
                  Mantener relación 1:1
                </Label>
                <Switch
                  id="keepAspectRatio"
                  checked={selectedElement.keepAspectRatio ?? false}
                  onCheckedChange={(checked) =>
                    updateElement(selectedElement.id, {
                      keepAspectRatio: checked,
                      ...(checked && { height: selectedElement.width }),
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="useCompetitorAvatar" className="text-xs">
                  Usar avatar del competidor
                </Label>
                <Switch
                  id="useCompetitorAvatar"
                  checked={selectedElement.imageUrl === "/avatar.png"}
                  onCheckedChange={(checked) =>
                    updateElement(selectedElement.id, {
                      imageUrl: checked ? "/avatar.png" : "",
                    })
                  }
                />
              </div>
            </div>
            {selectedElement.imageUrl === "/avatar.png" ? null : (
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-xs">
                  URL de la imagen
                </Label>
                <Input
                  id="imageUrl"
                  value={
                    selectedElement.imageUrl === "/avatar.png"
                      ? ""
                      : selectedElement.imageUrl || ""
                  }
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      imageUrl: e.target.value,
                    })
                  }
                  className="h-8"
                  placeholder="Ingrese la URL de la imagen"
                />
              </div>
            )}
          </>
        )}

        {selectedElement.type === "qrcode" && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="keepAspectRatio" className="text-xs">
                  Mantener relación 1:1
                </Label>
                <Switch
                  id="keepAspectRatio"
                  checked={selectedElement.keepAspectRatio ?? false}
                  onCheckedChange={(checked) =>
                    updateElement(selectedElement.id, {
                      keepAspectRatio: checked,
                      ...(checked && { height: selectedElement.width }),
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Fuente de datos del QR</Label>
              <RadioGroup
                value={selectedElement.qrDataSource || "custom"}
                onValueChange={(value) =>
                  updateElement(selectedElement.id, {
                    qrDataSource: value as
                      | "wca-live"
                      | "competition-groups"
                      | "custom",
                    qrData:
                      value === "wca-live"
                        ? "https://live.worldcubeassociation.org/"
                        : value === "competition-groups"
                          ? "https://www.competitiongroups.com/"
                          : "",
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wca-live" id="wca-live" />
                  <Label
                    htmlFor="wca-live"
                    className="text-xs font-normal cursor-pointer"
                  >
                    <WcaMonochrome className="size-4" />
                    WCA Live de la competencia
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="competition-groups"
                    id="competition-groups"
                  />
                  <Label
                    htmlFor="competition-groups"
                    className="text-xs font-normal cursor-pointer"
                  >
                    <WcaMonochrome className="size-4" />
                    Tareas del competidor en Competition Groups
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label
                    htmlFor="custom"
                    className="text-xs font-normal cursor-pointer"
                  >
                    Personalizado
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {selectedElement.qrDataSource !== "custom" ? null : (
              <div className="space-y-2">
                <Label htmlFor="qrData" className="text-xs">
                  Contenido del QR
                </Label>
                <Input
                  id="qrData"
                  value={selectedElement.qrData || ""}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      qrData: e.target.value,
                    })
                  }
                  placeholder="Contenido del QR"
                  className="h-8"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="qrForeground" className="text-xs">
                Color del QR
              </Label>
              <ColorPicker
                value={selectedElement.qrForeground || "#000000"}
                onValueChange={(color) => {
                  if (color !== selectedElement.qrForeground) {
                    updateElement(selectedElement.id, { qrForeground: color });
                  }
                }}
                defaultFormat="hex"
                className="w-full"
              >
                <div className="flex items-center gap-3">
                  <ColorPickerTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-3"
                    >
                      <ColorPickerSwatch className="size-4" />
                      {selectedElement.qrForeground || "#000000"}
                    </Button>
                  </ColorPickerTrigger>
                </div>
                <ColorPickerContent>
                  <ColorPickerArea />
                  <div className="flex items-center gap-2">
                    <ColorPickerEyeDropper />
                    <div className="flex flex-1 flex-col gap-2">
                      <ColorPickerHueSlider />
                      <ColorPickerAlphaSlider />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ColorPickerFormatSelect />
                    <ColorPickerInput />
                  </div>
                </ColorPickerContent>
              </ColorPicker>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qrBackground" className="text-xs">
                Color de fondo
              </Label>
              <ColorPicker
                value={selectedElement.qrBackground || "#ffffff"}
                onValueChange={(color) => {
                  if (color !== selectedElement.qrBackground) {
                    updateElement(selectedElement.id, { qrBackground: color });
                  }
                }}
                defaultFormat="hex"
                className="w-full"
              >
                <div className="flex items-center gap-3">
                  <ColorPickerTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-3"
                    >
                      <ColorPickerSwatch className="size-4" />
                      {selectedElement.qrBackground || "#ffffff"}
                    </Button>
                  </ColorPickerTrigger>
                </div>
                <ColorPickerContent>
                  <ColorPickerArea />
                  <div className="flex items-center gap-2">
                    <ColorPickerEyeDropper />
                    <div className="flex flex-1 flex-col gap-2">
                      <ColorPickerHueSlider />
                      <ColorPickerAlphaSlider />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ColorPickerFormatSelect />
                    <ColorPickerInput />
                  </div>
                </ColorPickerContent>
              </ColorPicker>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qrErrorCorrection" className="text-xs">
                Nivel de corrección de errores
              </Label>
              <Select
                value={selectedElement.qrErrorCorrection || "M"}
                onValueChange={(value) =>
                  updateElement(selectedElement.id, {
                    qrErrorCorrection: value as "L" | "M" | "Q" | "H",
                  })
                }
              >
                <SelectTrigger id="qrErrorCorrection" className="w-full">
                  <SelectValue placeholder="Nivel de corrección" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Bajo (L) - 7%</SelectItem>
                  <SelectItem value="M">Medio (M) - 15%</SelectItem>
                  <SelectItem value="Q">Alto (Q) - 25%</SelectItem>
                  <SelectItem value="H">Muy Alto (H) - 30%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
