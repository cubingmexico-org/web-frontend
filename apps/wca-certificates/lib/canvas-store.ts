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
  setBackgroundImageBack: (imageUrl: string | undefined) => void;
  setElements: (elements: {
    front: CanvasElement[];
    back: CanvasElement[];
  }) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  setActiveSide: (side: "front" | "back") => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  elements: {
    front: [],
    back: [],
  },
  enableBackSide: false,
  setEnableBackSide: (enable) => set({ enableBackSide: enable }),
  selectedElementId: null,
  canvasWidth: 638,
  canvasHeight: 1012,
  opacity: 1,
  backgroundImage: undefined,
  backgroundImageBack: undefined,
  zoom: 1,
  activeSide: "front",

  addElement: (element) =>
    set((state) => ({
      elements: {
        ...state.elements,
        [state.activeSide]: [...state.elements[state.activeSide], element],
      },
      selectedElementId: element.id,
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: {
        ...state.elements,
        [state.activeSide]: state.elements[state.activeSide].map((el) =>
          el.id === id ? { ...el, ...updates } : el,
        ),
      },
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: {
        ...state.elements,
        [state.activeSide]: state.elements[state.activeSide].filter(
          (el) => el.id !== id,
        ),
      },
      selectedElementId:
        state.selectedElementId === id ? null : state.selectedElementId,
    })),

  selectElement: (id) => set({ selectedElementId: id }),

  clearCanvas: () =>
    set((state) => ({
      elements: {
        ...state.elements,
        [state.activeSide]: [],
      },
      selectedElementId: null,
    })),

  setCanvasSize: (width, height) =>
    set({ canvasWidth: width, canvasHeight: height }),

  setBackgroundImage: (imageUrl) => set({ backgroundImage: imageUrl }),

  setBackgroundImageBack: (imageUrl) => set({ backgroundImageBack: imageUrl }),

  setElements: (elements) => set({ elements, selectedElementId: null }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),

  setActiveSide: (side) => set({ activeSide: side, selectedElementId: null }),
}));
