"use client";

import { Button } from "@workspace/ui/components/button";
import { Type, Square, Circle, ImageIcon } from "lucide-react";
import { useCanvasStore } from "@/lib/canvas-store";

export function Toolbar() {
  const { addElement } = useCanvasStore();

  const addText = () => {
    addElement({
      id: `text-${Date.now()}`,
      type: "text",
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      rotation: 0,
      content: "Double click to edit",
      fontSize: 24,
      color: "#000000",
    });
  };

  const addRectangle = () => {
    addElement({
      id: `rect-${Date.now()}`,
      type: "rectangle",
      x: 150,
      y: 150,
      width: 200,
      height: 150,
      rotation: 0,
      backgroundColor: "#3b82f6",
    });
  };

  const addCircle = () => {
    addElement({
      id: `circle-${Date.now()}`,
      type: "circle",
      x: 200,
      y: 200,
      width: 150,
      height: 150,
      rotation: 0,
      backgroundColor: "#8b5cf6",
    });
  };

  const addImage = () => {
    addElement({
      id: `image-${Date.now()}`,
      type: "image",
      x: 250,
      y: 250,
      width: 300,
      height: 200,
      rotation: 0,
      imageUrl: "/abstract-geometric-shapes.png",
    });
  };

  return (
    <div className="w-20 bg-card border-r border-border flex flex-col items-center gap-2 py-4">
      <Button
        variant="ghost"
        size="icon"
        className="w-14 h-14 flex flex-col gap-1"
        onClick={addText}
        title="Add Text"
      >
        <Type className="h-5 w-5" />
        <span className="text-xs">Text</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="w-14 h-14 flex flex-col gap-1"
        onClick={addRectangle}
        title="Add Rectangle"
      >
        <Square className="h-5 w-5" />
        <span className="text-xs">Box</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="w-14 h-14 flex flex-col gap-1"
        onClick={addCircle}
        title="Add Circle"
      >
        <Circle className="h-5 w-5" />
        <span className="text-xs">Circle</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="w-14 h-14 flex flex-col gap-1"
        onClick={addImage}
        title="Add Image"
      >
        <ImageIcon className="h-5 w-5" />
        <span className="text-xs">Image</span>
      </Button>
    </div>
  );
}
