"use client";

import { create } from "zustand";
import type { CanvasElement, CanvasState } from "@/types/canvas";

interface CanvasStore extends CanvasState {
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  clearCanvas: () => void;
  setCanvasSize: (width: number, height: number) => void;
  setBackgroundImage: (imageUrl: string | undefined) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  elements: [],
  selectedElementId: null,
  canvasWidth: 638,
  canvasHeight: 1012,
  backgroundImage: undefined,
  zoom: 1,

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
      selectedElementId: element.id,
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el,
      ),
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementId:
        state.selectedElementId === id ? null : state.selectedElementId,
    })),

  selectElement: (id) => set({ selectedElementId: id }),

  clearCanvas: () => set({ elements: [], selectedElementId: null }),

  setCanvasSize: (width, height) =>
    set({ canvasWidth: width, canvasHeight: height }),

  setBackgroundImage: (imageUrl) => set({ backgroundImage: imageUrl }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),
}));
