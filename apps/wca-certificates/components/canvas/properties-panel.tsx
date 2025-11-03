"use client";

import { useCanvasStore } from "@/lib/canvas-store";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";
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

export function PropertiesPanel() {
  const { elements, selectedElementId, updateElement, deleteElement } =
    useCanvasStore();

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className="w-80 bg-card border-l border-border p-4">
        <p className="text-sm text-muted-foreground">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Properties</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteElement(selectedElement.id)}
          title="Delete element"
        >
          <Trash2 />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Position</Label>
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
          <Label className="text-xs text-muted-foreground">Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width" className="text-xs">
                Width
              </Label>
              <Input
                id="width"
                type="number"
                value={Math.round(selectedElement.width)}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    width: Number(e.target.value),
                  })
                }
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">
                Height
              </Label>
              <Input
                id="height"
                type="number"
                value={Math.round(selectedElement.height)}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    height: Number(e.target.value),
                  })
                }
                className="h-8"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rotation" className="text-xs">
            Rotation: {selectedElement.rotation}°
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
                Text Content
              </Label>
              <Input
                id="content"
                value={selectedElement.content || ""}
                onChange={(e) =>
                  updateElement(selectedElement.id, { content: e.target.value })
                }
                className="h-8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fontFamily" className="text-xs">
                Font Family
              </Label>
              <Select
                value={selectedElement.fontFamily || "Arial"}
                onValueChange={(value) =>
                  updateElement(selectedElement.id, { fontFamily: value })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">
                    Times New Roman
                  </SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  <SelectItem value="Verdana">Verdana</SelectItem>
                  <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                  <SelectItem value="Impact">Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fontSize" className="text-xs">
                Font Size
              </Label>
              <Input
                id="fontSize"
                type="number"
                value={selectedElement.fontSize || 24}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    fontSize: Number(e.target.value),
                  })
                }
                className="h-8"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Text Alignment</Label>
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
                Text Color
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
              Fill Color
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
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-xs">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              value={selectedElement.imageUrl || ""}
              onChange={(e) =>
                updateElement(selectedElement.id, { imageUrl: e.target.value })
              }
              className="h-8"
              placeholder="Enter image URL"
            />
          </div>
        )}
      </div>
    </div>
  );
}
