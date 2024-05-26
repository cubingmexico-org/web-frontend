/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Undo,
  Redo,
  Code,
} from "lucide-react";
import { Button } from "@repo/ui/button";
import { Toggle } from "@repo/ui/toggle";

interface ToolbarProps {
  editor: Editor | null;
};

export default function Toolbar({ editor }: ToolbarProps) {

  if (!editor) {
    return null;
  }

  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center justify-center gap-1">
        <Toggle
          disabled={!editor.can().chain().focus().toggleBold().run()}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}
          size="sm"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          pressed={editor.isActive("heading", { level: 1 })}
          size="sm"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().setCode().run()}
          pressed={editor.isActive("code")}
          size="sm"
        >
          <Code className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="flex items-center justify-center gap-1">
        <Button
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
          size='sm'
          variant='ghost'
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
          size='sm'
          variant='ghost'
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}