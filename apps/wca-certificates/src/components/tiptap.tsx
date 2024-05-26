/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
/* eslint-disable @typescript-eslint/no-shadow -- . */
/* eslint-disable import/no-named-as-default -- . */
'use client'

import type { JSONContent } from '@tiptap/react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { podium } from '@/lib/placeholders';
import Toolbar from './toolbar';

interface TiptapProps {
  onChange: (newContent: JSONContent) => void;
};

export default function Tiptap({ onChange }: TiptapProps): JSX.Element {
  const handleChange = (newContent: JSONContent) => {
    onChange(newContent);
  };
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    editorProps: {
      attributes: {
        class:
          "flex flex-col min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    content: podium,
    onUpdate: ({ editor }) => {
      handleChange(editor.getJSON());
    },
  })

  return (
    <div className="w-full">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}