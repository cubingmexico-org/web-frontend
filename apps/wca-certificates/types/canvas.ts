export type ElementType = "text" | "rectangle" | "circle" | "image";

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  imageUrl?: string;
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  backgroundImage?: string;
}
