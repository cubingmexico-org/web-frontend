export type ElementType = "text" | "rectangle" | "circle" | "image" | "qrcode";

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: "center" | "end" | "left" | "right" | "start";
  color?: string;
  backgroundColor?: string;
  imageUrl?: string;
  borderRadius?: number;
  keepAspectRatio?: boolean;
  qrData?: string;
  qrForeground?: string;
  qrBackground?: string;
  qrErrorCorrection?: "L" | "M" | "Q" | "H";
  qrDataSource?: "wca-live" | "competition-groups" | "custom";
}

export interface CanvasState {
  elements: {
    front: CanvasElement[];
    back: CanvasElement[];
  };
  enableBackSide: boolean;
  setEnableBackSide: (enable: boolean) => void;
  activeSide: "front" | "back";
  setActiveSide: (side: "front" | "back") => void;
  selectedElementId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  backgroundImage?: string;
  backgroundImageBack?: string;
}
