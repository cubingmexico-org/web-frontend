/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import {
  MenubarItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@repo/ui/menubar"

interface SubmenuProps {
  editor: Editor | null;
};

export default function Submenu({ editor }: SubmenuProps) {

  if (!editor) {
    return null;
  }

  return (
    <MenubarSub>
      <MenubarSubTrigger>Uso de mayúsculas</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem onClick={() => editor.chain().focus().setTransform('lowercase').run()}>minúscula</MenubarItem>
        <MenubarItem onClick={() => editor.chain().focus().setTransform('uppercase').run()}>MAYÚSCULA</MenubarItem>
        <MenubarItem onClick={() => editor.chain().focus().setTransform('capitalize').run()}>Todas Las Palabras Con Mayúscula</MenubarItem>
      </MenubarSubContent>
    </MenubarSub>
  );
}