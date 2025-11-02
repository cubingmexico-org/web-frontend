"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useCanvasStore } from "@/lib/canvas-store";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";

export function CanvasSettings() {
  const { canvasWidth, canvasHeight, setCanvasSize } = useCanvasStore();
  const [width, setWidth] = useState(canvasWidth);
  const [height, setHeight] = useState(canvasHeight);

  const handleApplySize = () => {
    setCanvasSize(width, height);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title="Canvas Settings">
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Canvas Settings</SheetTitle>
          <SheetDescription>
            Customize your canvas size and background
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4">
          <div className="space-y-4">
            <h3 className="font-medium">Canvas Size</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={100}
                  max={5000}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={100}
                  max={5000}
                />
              </div>
            </div>
            <Button onClick={handleApplySize} className="w-full">
              Apply Size
            </Button>

            <div className="space-y-2">
              <Label>Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWidth(638);
                    setHeight(1012);
                  }}
                >
                  CR-80 (638×1012)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWidth(1012);
                    setHeight(638);
                  }}
                >
                  CR-80 (1012×638)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWidth(615);
                    setHeight(991);
                  }}
                >
                  CR-79 (615×991)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWidth(991);
                    setHeight(615);
                  }}
                >
                  CR-79 (991×615)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
