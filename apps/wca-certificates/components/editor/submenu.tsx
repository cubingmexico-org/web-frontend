/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import {
  MenubarItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@repo/ui/menubar";
import type { getDictionary } from "@/get-dictionary";

interface SubmenuProps {
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >["certificates"]["podium"]["document_settings"]["tiptap"]["submenu"];
  editor: Editor | null;
}

export default function Submenu({ dictionary, editor }: SubmenuProps) {
  if (!editor) {
    return null;
  }

  return (
    <MenubarSub>
      <MenubarSubTrigger>{dictionary.useCapitalLetters}</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem
          onClick={() => editor.chain().focus().setTransform("lowercase").run()}
        >
          {dictionary.lowercase}
        </MenubarItem>
        <MenubarItem
          onClick={() => editor.chain().focus().setTransform("uppercase").run()}
        >
          {dictionary.uppercase}
        </MenubarItem>
        <MenubarItem
          onClick={() =>
            editor.chain().focus().setTransform("capitalize").run()
          }
        >
          {dictionary.capitalize}
        </MenubarItem>
      </MenubarSubContent>
    </MenubarSub>
  );
}
