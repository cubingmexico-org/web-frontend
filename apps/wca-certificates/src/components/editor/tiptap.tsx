/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
/* eslint-disable @typescript-eslint/no-shadow -- . */
/* eslint-disable import/no-named-as-default -- . */
'use client'

import type { JSONContent } from '@tiptap/react';
import { useEditor, EditorContent } from '@tiptap/react'
import Mention from '@tiptap/extension-mention'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import { podium } from '@/lib/placeholders';
import Toolbar from './toolbar';
import suggestion from './mentions/suggestion'
import type { PageSize, PageOrientation } from 'pdfmake/interfaces';
import { cn } from '@repo/ui/utils';

interface TiptapProps {
  pageSize: PageSize;
  pageOrientation: PageOrientation;
  onChange: (newContent: JSONContent) => void;
};

export default function Tiptap({
  pageSize,
  pageOrientation,
  onChange
}: TiptapProps): JSX.Element {
  console.log(pageOrientation)
  console.log(pageSize)
  const handleChange = (newContent: JSONContent) => {
    onChange(newContent);
  };
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontFamily
    ],
    editorProps: {
      attributes: {
        class: cn(
          'flex flex-col rounded-md border border-input bg-background px-[40px] py-[60px] text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', {
          'w-[612px] h-[792px]': pageSize === 'LETTER' && pageOrientation === 'portrait',
          'w-[792px] h-[612px]': pageSize === 'LETTER' && pageOrientation === 'landscape',
          'w-[595px] h-[842px]': pageSize === 'A4' && pageOrientation === 'portrait',
          'w-[842px] h-[595px]': pageSize === 'A4' && pageOrientation === 'landscape',
          }
        )
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