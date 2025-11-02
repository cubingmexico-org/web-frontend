"use client";

import { useCanvasStore } from "@/lib/canvas-store";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Slider } from "@workspace/ui/components/slider";
import { Trash2 } from "lucide-react";

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
          <Trash2 className="h-4 w-4" />
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
              <Label htmlFor="textColor" className="text-xs">
                Text Color
              </Label>
              <Input
                id="textColor"
                type="color"
                value={selectedElement.color || "#000000"}
                onChange={(e) =>
                  updateElement(selectedElement.id, { color: e.target.value })
                }
                className="h-10"
              />
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
