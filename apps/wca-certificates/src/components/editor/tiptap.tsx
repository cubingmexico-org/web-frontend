/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
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
import type { PageSize, PageOrientation, Margins } from 'pdfmake/interfaces';
import { cn } from '@repo/ui/utils';
import Color from '@tiptap/extension-color';
import { podium } from '@/lib/placeholders';
import Toolbar from './toolbar';
import suggestion from './mentions/suggestion'

interface TiptapProps {
  pageSize: PageSize;
  pageOrientation: PageOrientation;
  pageMargins: Margins;
  onChange: (newContent: JSONContent) => void;
};

export default function Tiptap({
  pageSize,
  pageOrientation,
  onChange
}: TiptapProps): JSX.Element {
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
      FontFamily,
      Color.configure({
        types: ['textStyle'],
      })
    ],
    editorProps: {
      attributes: {
        class: cn(
          'flex flex-col shadow bg-background px-[40pt] py-[60pt] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50', {
          'w-[612pt] h-[792pt]': pageSize === 'LETTER' && pageOrientation === 'portrait',
          'w-[792pt] h-[612pt]': pageSize === 'LETTER' && pageOrientation === 'landscape',
          'w-[595pt] h-[842pt]': pageSize === 'A4' && pageOrientation === 'portrait',
          'w-[842pt] h-[595pt]': pageSize === 'A4' && pageOrientation === 'landscape',
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
      <div className='flex justify-center bg-secondary py-8 my-4'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}