"use client";

import { CanvasEditor } from "@/components/canvas/canvas-editor";
import { Toolbar } from "@/components/canvas/toolbar";
import { PropertiesPanel } from "@/components/canvas/properties-panel";
import { CanvasSettings } from "@/components/canvas/canvas-settings";
import { Button } from "@workspace/ui/components/button";
import { Download, Eye, FlipHorizontal } from "lucide-react";
import { useCanvasStore } from "@/lib/canvas-store";
import type { CanvasElement } from "@/types/canvas";

export function Canvas() {
  const {
    elements,
    canvasWidth,
    canvasHeight,
    backgroundImage,
    activeSide,
    setActiveSide,
    enableBackSide,
  } = useCanvasStore();

  const previewCanvas = () => {
    // Preview front side
    const frontCanvas = createCanvasForSide("front");
    // Preview back side
    const backCanvas = createCanvasForSide("back");

    if (frontCanvas && backCanvas) {
      openBothCanvases(frontCanvas, backCanvas);
    }
  };

  const createCanvasForSide = (side: "front" | "back") => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const sideElements = elements[side] || [];

    if (backgroundImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = backgroundImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawElements(ctx, sideElements);
      };
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawElements(ctx, sideElements);
    }

    return canvas;
  };

  function drawElements(
    ctx: CanvasRenderingContext2D,
    elementsArray: CanvasElement[],
  ) {
    elementsArray.forEach((element) => {
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
          ctx.fillStyle = element.color || "#000000";
          ctx.font = `${element.fontWeight || "normal"} ${element.fontSize || 24}px ${element.fontFamily || "sans-serif"}`;
          ctx.textAlign = element.textAlign || "left";

          let textX = element.x;
          if (element.textAlign === "center") {
            textX = element.x + element.width / 2;
          } else if (element.textAlign === "right") {
            textX = element.x + element.width;
          }

          ctx.fillText(
            element.content || "Text",
            textX,
            element.y + (element.fontSize || 24),
          );

          ctx.textAlign = "left";
          break;
        }
        case "image":
          if (element.imageUrl) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = element.imageUrl;
            if (img.complete) {
              ctx.drawImage(
                img,
                element.x,
                element.y,
                element.width,
                element.height,
              );
            }
          }
          break;
      }

      ctx.restore();
    });
  }

  function openBothCanvases(
    frontCanvas: HTMLCanvasElement,
    backCanvas: HTMLCanvasElement,
  ) {
    frontCanvas.toBlob((frontBlob) => {
      if (!frontBlob) return;
      backCanvas.toBlob((backBlob) => {
        if (!backBlob) return;

        const frontUrl = URL.createObjectURL(frontBlob);
        const backUrl = URL.createObjectURL(backBlob);

        window.open(frontUrl, "_blank");
        window.open(backUrl, "_blank");
      });
    });
  }

  const exportToJSON = () => {
    const data = JSON.stringify(
      { elements, canvasWidth, canvasHeight, backgroundImage },
      null,
      2,
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background border">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">Gafetes</h1>
          <span className="text-sm text-muted-foreground">
            {canvasWidth} × {canvasHeight}px
          </span>
          {enableBackSide && (
            <div className="flex items-center gap-2 border-l pl-4">
              <Button
                variant={activeSide === "front" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSide("front")}
              >
                Frente
              </Button>
              <Button
                variant={activeSide === "back" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSide("back")}
              >
                <FlipHorizontal />
                Reverso
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CanvasSettings />
          <Button variant="outline" size="sm" onClick={exportToJSON}>
            <Download />
            Exportar JSON
          </Button>
          <Button variant="default" size="sm" onClick={previewCanvas}>
            <Eye />
            Previsualizar
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Toolbar />
        <CanvasEditor />
        <PropertiesPanel />
      </div>
    </div>
  );
}
