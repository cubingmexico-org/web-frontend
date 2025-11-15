"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { useCanvasStore } from "@/lib/canvas-store";
import { ZoomControls } from "./zoom-controls";

export function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const {
    elements,
    selectedElementId,
    selectElement,
    updateElement,
    canvasWidth,
    canvasHeight,
    backgroundImage,
    zoom,
  } = useCanvasStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fontSize: 0, // Add fontSize to resize start state
  });
  const [isEditingText, setIsEditingText] = useState(false);
  const [editingText, setEditingText] = useState("");
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = backgroundImage;
      img.onload = () => {
        backgroundImageRef.current = img;
        // Trigger a redraw after image loads
        drawCanvas();
      };
    } else {
      backgroundImageRef.current = null;
      drawCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundImage]);

  const measureText = (
    text: string,
    fontSize: number,
    fontFamily: string,
    fontWeight: string,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 0, height: fontSize };

    const ctx = canvas.getContext("2d");
    if (!ctx) return { width: 0, height: fontSize };

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    return {
      width: metrics.width,
      height: fontSize * 1.2, // Add some padding for height
    };
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (backgroundImageRef.current && backgroundImageRef.current.complete) {
      ctx.drawImage(
        backgroundImageRef.current,
        0,
        0,
        canvas.width,
        canvas.height,
      );
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw elements
    elements.forEach((element) => {
      ctx.save();

      // Apply transformations
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      // Draw based on type
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
          const fontSize = element.fontSize || 24;
          const fontFamily = element.fontFamily || "sans-serif";
          const fontWeight = element.fontWeight || "normal";
          const content = element.content || "Text";

          ctx.fillStyle = element.color || "#000000";
          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.textAlign = element.textAlign || "left";

          let textX = element.x;
          // Adjust x position based on alignment
          if (element.textAlign === "center") {
            textX = element.x + element.width / 2;
          } else if (element.textAlign === "right") {
            textX = element.x + element.width;
          }

          ctx.fillText(content, textX, element.y + fontSize);

          // Reset text align to prevent affecting other drawings
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
          } else {
            // Placeholder for images without URL
            ctx.fillStyle = "#e5e7eb";
            ctx.fillRect(element.x, element.y, element.width, element.height);
            ctx.fillStyle = "#9ca3af";
            ctx.font = "16px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(
              "Image",
              element.x + element.width / 2,
              element.y + element.height / 2,
            );
            ctx.textAlign = "left";
          }
          break;
      }

      // Draw selection border
      if (element.id === selectedElementId) {
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          element.x - 2,
          element.y - 2,
          element.width + 4,
          element.height + 4,
        );
        ctx.setLineDash([]);

        const handleSize = 8;
        const handles = [
          { x: element.x - handleSize / 2, y: element.y - handleSize / 2 }, // top-left
          {
            x: element.x + element.width - handleSize / 2,
            y: element.y - handleSize / 2,
          }, // top-right
          {
            x: element.x - handleSize / 2,
            y: element.y + element.height - handleSize / 2,
          }, // bottom-left
          {
            x: element.x + element.width - handleSize / 2,
            y: element.y + element.height - handleSize / 2,
          }, // bottom-right
        ];

        ctx.fillStyle = "#6366f1";
        handles.forEach((handle) => {
          ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
        });
      }

      ctx.restore();
    });
  };

  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, selectedElementId, canvasWidth, canvasHeight]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getResizeHandle = (x: number, y: number, element: any) => {
    const handleSize = 8;
    const handles = [
      {
        name: "top-left",
        x: element.x - handleSize / 2,
        y: element.y - handleSize / 2,
      },
      {
        name: "top-right",
        x: element.x + element.width - handleSize / 2,
        y: element.y - handleSize / 2,
      },
      {
        name: "bottom-left",
        x: element.x - handleSize / 2,
        y: element.y + element.height - handleSize / 2,
      },
      {
        name: "bottom-right",
        x: element.x + element.width - handleSize / 2,
        y: element.y + element.height - handleSize / 2,
      },
    ];

    for (const handle of handles) {
      if (
        x >= handle.x &&
        x <= handle.x + handleSize &&
        y >= handle.y &&
        y <= handle.y + handleSize
      ) {
        return handle.name;
      }
    }
    return null;
  };

  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (scale * zoom);
    const y = (e.clientY - rect.top) / (scale * zoom);

    const clickedElement = [...elements].reverse().find((element) => {
      return (
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height
      );
    });

    if (clickedElement && clickedElement.type === "text") {
      setIsEditingText(true);
      setEditingText(clickedElement.content || "");
      setTimeout(() => textInputRef.current?.focus(), 0);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (scale * zoom);
    const y = (e.clientY - rect.top) / (scale * zoom);

    // Find clicked element (reverse order to check top elements first)
    const clickedElement = [...elements].reverse().find((element) => {
      return (
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height
      );
    });

    if (clickedElement) {
      selectElement(clickedElement.id);
      setDragOffset({
        x: x - clickedElement.x,
        y: y - clickedElement.y,
      });
    } else {
      selectElement(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedElementId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (scale * zoom);
    const y = (e.clientY - rect.top) / (scale * zoom);

    const selectedElement = elements.find((el) => el.id === selectedElementId);
    if (!selectedElement) return;

    const handle = getResizeHandle(x, y, selectedElement);
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      setResizeStart({
        x: selectedElement.x,
        y: selectedElement.y,
        width: selectedElement.width,
        height: selectedElement.height,
        fontSize: selectedElement.fontSize || 24,
      });
    } else {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (scale * zoom);
    const y = (e.clientY - rect.top) / (scale * zoom);

    if (isResizing && selectedElementId && resizeHandle) {
      const selectedElement = elements.find(
        (el) => el.id === selectedElementId,
      );
      if (!selectedElement) return;

      let newX = resizeStart.x;
      let newY = resizeStart.y;
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      switch (resizeHandle) {
        case "top-left":
          newWidth = resizeStart.width + (resizeStart.x - x);
          newHeight = resizeStart.height + (resizeStart.y - y);
          newX = x;
          newY = y;
          break;
        case "top-right":
          newWidth = x - resizeStart.x;
          newHeight = resizeStart.height + (resizeStart.y - y);
          newY = y;
          break;
        case "bottom-left":
          newWidth = resizeStart.width + (resizeStart.x - x);
          newHeight = y - resizeStart.y;
          newX = x;
          break;
        case "bottom-right":
          newWidth = x - resizeStart.x;
          newHeight = y - resizeStart.y;
          break;
      }

      // For images with aspect ratio locked, maintain 1:1 ratio
      if (selectedElement.type === "image" && selectedElement.keepAspectRatio) {
        const size = Math.max(newWidth, newHeight);
        newWidth = size;
        newHeight = size;

        // Adjust position based on which handle is being dragged
        if (resizeHandle === "top-left") {
          newX = resizeStart.x + resizeStart.width - size;
          newY = resizeStart.y + resizeStart.height - size;
        } else if (resizeHandle === "top-right") {
          newY = resizeStart.y + resizeStart.height - size;
        } else if (resizeHandle === "bottom-left") {
          newX = resizeStart.x + resizeStart.width - size;
        }
        // bottom-right doesn't need position adjustment
      }

      // For text elements, adjust font size based on resize
      if (selectedElement.type === "text" && newWidth > 20 && newHeight > 20) {
        const widthRatio = newWidth / resizeStart.width;
        const heightRatio = newHeight / resizeStart.height;
        const scaleRatio = Math.min(widthRatio, heightRatio);
        const newFontSize = Math.max(
          8,
          (resizeStart.fontSize || 24) * scaleRatio,
        );

        const content = selectedElement.content || "Text";
        const dimensions = measureText(
          content,
          newFontSize,
          selectedElement.fontFamily || "sans-serif",
          selectedElement.fontWeight || "normal",
        );

        updateElement(selectedElementId, {
          x: newX,
          y: newY,
          width: dimensions.width,
          height: dimensions.height,
          fontSize: newFontSize,
        });
      } else if (newWidth > 20 && newHeight > 20) {
        // For non-text elements, maintain minimum size constraints
        updateElement(selectedElementId, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
      return;
    }

    // Handle dragging
    if (isDragging && selectedElementId) {
      updateElement(selectedElementId, {
        x: x - dragOffset.x,
        y: y - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleTextEditComplete = () => {
    if (selectedElementId && isEditingText) {
      const selectedElement = elements.find(
        (el) => el.id === selectedElementId,
      );
      if (selectedElement) {
        const fontSize = selectedElement.fontSize || 24;
        const fontFamily = selectedElement.fontFamily || "sans-serif";
        const fontWeight = selectedElement.fontWeight || "normal";

        const dimensions = measureText(
          editingText || "Text",
          fontSize,
          fontFamily,
          fontWeight,
        );

        updateElement(selectedElementId, {
          content: editingText,
          width: dimensions.width,
          height: dimensions.height,
        });
      }
    }
    setIsEditingText(false);
    setEditingText("");
  };

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaleX = containerWidth / canvasWidth;
      const scaleY = containerHeight / canvasHeight;
      setScale(Math.min(scaleX, scaleY, 1));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasWidth, canvasHeight]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-[calc(100%-25rem)] h-full bg-muted/30 p-8"
    >
      <div
        className="relative"
        style={{
          transform: `scale(${scale * zoom})`,
          transformOrigin: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
          onDoubleClick={handleCanvasDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="bg-white shadow-2xl cursor-pointer"
        />
        {isEditingText && selectedElementId && (
          <input
            ref={textInputRef}
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={handleTextEditComplete}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTextEditComplete();
              }
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 text-lg rounded-md focus:outline-none focus:ring-0 text-black"
            style={{ minWidth: "200px" }}
          />
        )}
      </div>
      <ZoomControls />
    </div>
  );
}
