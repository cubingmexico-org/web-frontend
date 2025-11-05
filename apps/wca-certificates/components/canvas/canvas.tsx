"use client";

import { CanvasEditor } from "@/components/canvas/canvas-editor";
import { Toolbar } from "@/components/canvas/toolbar";
import { PropertiesPanel } from "@/components/canvas/properties-panel";
import { CanvasSettings } from "@/components/canvas/canvas-settings";
import { Button } from "@workspace/ui/components/button";
import { Download, Eye } from "lucide-react";
import { useCanvasStore } from "@/lib/canvas-store";

export function Canvas() {
  const { elements, canvasWidth, canvasHeight, backgroundImage } =
    useCanvasStore();

  const previewCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (backgroundImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = backgroundImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawElements();
        openCanvas();
      };
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawElements();
      openCanvas();
    }

    function drawElements() {
      if (!ctx) return;

      // Draw all elements
      elements.forEach((element) => {
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

    function openCanvas() {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const newWindow = window.open(url, "_blank");

        // Clean up the URL after the window loads
        if (newWindow) {
          newWindow.onload = () => {
            URL.revokeObjectURL(url);
          };
        }
      });
    }
  };

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
