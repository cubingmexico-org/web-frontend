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
import CharacterCount from '@tiptap/extension-character-count'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import type { PageSize, PageOrientation, Margins } from 'pdfmake/interfaces';
import { cn } from '@repo/ui/utils';
import Color from '@tiptap/extension-color';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@repo/ui/menubar"
import { Save, Loader, RotateCcw, Sheet, FileDown, Bold, Pilcrow, AlignLeft, Undo, Redo, Scissors, Files, Clipboard, TextSelect } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { DialogDocumentSettings } from '@/components/editor/dialog-document-settings';
import { TextTransform } from '@/lib/text-transform';
import { FontSize } from '@/lib/font-size';
import Toolbar from './toolbar';
import suggestion from './mentions/suggestion'
import Submenu from './submenu';

interface TiptapProps {
  content: JSONContent;
  pdfDisabled: boolean;
  pageSize: PageSize;
  pageOrientation: PageOrientation;
  pageMargins: Margins;
  pdfOnClick: () => void;
  setPageSize: (value: PageSize) => void;
  setPageOrientation: (value: PageOrientation) => void;
  setPageMargins: (value: Margins) => void;
  onChange: (newContent: JSONContent) => void;
};

export default function Tiptap({
  content,
  pdfDisabled,
  pageSize,
  pageOrientation,
  pageMargins,
  pdfOnClick,
  setPageSize,
  setPageOrientation,
  setPageMargins,
  onChange
}: TiptapProps) {
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
      FontSize,
      Color.configure({
        types: ['textStyle'],
      }),
      TextTransform.configure({
        types: ['textStyle'],
      }),
      CharacterCount.configure({
        limit: 400,
      }),
      Table,
      TableCell,
      TableHeader,
      TableRow,
    ],
    editorProps: {
      attributes: {
        class: cn(
          'shadow bg-background px-[40pt] py-[60pt] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-y-clip', {
          'w-[612pt] h-[792pt]': pageSize === 'LETTER' && pageOrientation === 'portrait',
          'w-[792pt] h-[612pt]': pageSize === 'LETTER' && pageOrientation === 'landscape',
          'w-[595pt] h-[842pt]': pageSize === 'A4' && pageOrientation === 'portrait',
          'w-[842pt] h-[595pt]': pageSize === 'A4' && pageOrientation === 'landscape',
        })
      },
    },
    content,
    onUpdate: ({ editor }) => {
      handleChange(editor.getJSON());
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
      <Menubar className='mb-4'>
        <MenubarMenu>
          <MenubarTrigger>Archivo</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled><RotateCcw className='h-4 w-4 mr-2' />Reiniciar</MenubarItem>
            <MenubarItem disabled><Save className='h-4 w-4 mr-2' />Guardar</MenubarItem>
            <MenubarItem disabled><Loader className='h-4 w-4 mr-2' />Cargar</MenubarItem>
            <MenubarSeparator />
            <MenubarItem asChild>
              <Button className='!w-full !px-2 !py-1.5 !justify-start !font-normal !h-8' disabled={pdfDisabled} onClick={pdfOnClick} type="submit" variant='ghost'>
                <FileDown className='h-4 w-4 mr-2' />Exportar como PDF
              </Button>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem asChild>
              <DialogDocumentSettings
                pageMargins={pageMargins}
                pageOrientation={pageOrientation}
                pageSize={pageSize}
                setPageMargins={setPageMargins}
                setPageOrientation={setPageOrientation}
                setPageSize={setPageSize}
              />
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Editar</MenubarTrigger>
          <MenubarContent>
            <MenubarItem><Undo className='h-4 w-4 mr-2' />Deshacer</MenubarItem>
            <MenubarItem><Redo className='h-4 w-4 mr-2' />Rehacer</MenubarItem>
            <MenubarSeparator />
            <MenubarItem><Scissors className='h-4 w-4 mr-2' />Cortar</MenubarItem>
            <MenubarItem><Files className='h-4 w-4 mr-2' />Copiar</MenubarItem>
            <MenubarItem><Clipboard className='h-4 w-4 mr-2' />Pegar</MenubarItem>
            <MenubarSeparator />
            <MenubarItem><TextSelect className='h-4 w-4 mr-2' />Seleccionar todo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Insertar</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 3, withHeaderRow: true }).run()}>
              <Sheet className='h-4 w-4 mr-2' />Tabla
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Formato</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger><Bold className='h-4 w-4 mr-2' />Texto</MenubarSubTrigger>
              <MenubarSubContent>
                <Submenu editor={editor} />
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger><Pilcrow className='h-4 w-4 mr-2' />Estilos de párrafo</MenubarSubTrigger>
              <MenubarSubContent>

              </MenubarSubContent>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger><AlignLeft className='h-4 w-4 mr-2' />Alinear</MenubarSubTrigger>
              <MenubarSubContent>
                
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger><Sheet className='h-4 w-4 mr-2' />Tabla</MenubarSubTrigger>
              <MenubarSubContent>
                
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Toolbar editor={editor} />
      <div className='flex justify-center bg-secondary py-8 my-4'>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}