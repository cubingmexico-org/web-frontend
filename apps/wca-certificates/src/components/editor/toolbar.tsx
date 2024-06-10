/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
/* eslint-disable @typescript-eslint/no-misused-promises -- . */
// /* eslint-disable import/no-named-as-default-member -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  // Italic,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  // Type,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@repo/ui/button";
import { Toggle } from "@repo/ui/toggle";
import { Input } from "@repo/ui/input";
import { Combobox } from "../combobox-font";

interface ToolbarProps {
  editor: Editor | null;
};

export default function Toolbar({ editor }: ToolbarProps) {

  const loadFonts = async () => {
    const WebFont = await import('webfontloader');
    WebFont.load({
      google: {
        families: ['Roboto:400,700', 'Maven Pro:400,700']
      }
    });
  }

  if (!editor) {
    return <p>Cargando...</p>;
  }

  void loadFonts();

  return (
    <div className="flex justify-between items-start mx-6">
      <div className="flex items-center justify-center gap-1">
        <Combobox
          setValue={async (value) => {
            const WebFont = (await import('webfontloader')).default
            WebFont.load({
              google: {
                families: [`${value}:400,700`]
              }
            });
            editor.chain().focus().setFontFamily(value).run();
          }}
          value={editor.isActive('textStyle', { fontFamily: 'Maven Pro' }) ? 'Maven Pro' : 'Roboto'}
        />
        <Input
          className="h-9 w-32 p-0 border-0"
          data-testid="setColor"
          onChange={event => editor.chain().focus().setColor(event.target.value).run()}
          type="color"
          value={editor.getAttributes('textStyle').color || '#000000'}
        />
        <Toggle
          disabled={!editor.can().chain().focus().toggleBold().run()}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}
          size="sm"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        {/* <Toggle
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          pressed={editor.isActive("italic")}
          size="sm"
        >
          <Italic className="h-4 w-4" />
        </Toggle> */}
        <Toggle
          disabled={!editor.can().chain().focus().setParagraph().run()}
          onPressedChange={() => editor.chain().focus().setParagraph().run()}
          pressed={editor.isActive("paragraph")}
          size="sm"
        >
          <Pilcrow className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          pressed={editor.isActive("heading", { level: 1 })}
          size="sm"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          pressed={editor.isActive("heading", { level: 2 })}
          size="sm"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          pressed={editor.isActive("heading", { level: 3 })}
          size="sm"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          pressed={editor.isActive("heading", { level: 4 })}
          size="sm"
        >
          <Heading4 className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          pressed={editor.isActive("heading", { level: 5 })}
          size="sm"
        >
          <Heading5 className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          pressed={editor.isActive("heading", { level: 6 })}
          size="sm"
        >
          <Heading6 className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
          pressed={editor.isActive({ textAlign: 'left' })}
          size="sm"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
          pressed={editor.isActive({ textAlign: 'center' })}
          size="sm"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
          pressed={editor.isActive({ textAlign: 'right' })}
          size="sm"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle
          onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
          pressed={editor.isActive({ textAlign: 'justify' })}
          size="sm"
        >
          <AlignJustify className="h-4 w-4" />
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