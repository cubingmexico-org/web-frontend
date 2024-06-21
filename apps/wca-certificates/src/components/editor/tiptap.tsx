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
  MenubarCheckboxItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@repo/ui/menubar"
import {
  Save,
  Loader,
  RotateCcw,
  Sheet,
  FileDown,
  Bold,
  AlignLeft,
  Undo,
  Redo,
  Scissors,
  Files,
  Clipboard,
  TextSelect,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  Trash2,
  TableCellsMerge,
  TableCellsSplit,
  RemoveFormatting
} from 'lucide-react';
import { Button } from '@repo/ui/button';
import { DialogDocumentSettings } from '@/components/editor/dialog-document-settings';
import { TextTransform } from '@/components/editor/extensions/text-transform';
import { FontSize } from '@/components/editor/extensions/font-size';
import Toolbar from './toolbar';
import suggestionPodium from './mentions/suggestion-podium'
import suggestionParticipation from './mentions/suggestion-participation'
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
  variant: 'podium' | 'participation';
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
  onChange,
  variant,
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
        suggestion: variant === 'podium' ? suggestionPodium : suggestionParticipation,
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
          // [`pl-[${Array.isArray(pageMargins) ? pageMargins[0] : 0}pt]`]: Array.isArray(pageMargins),
          // [`pt-[${Array.isArray(pageMargins) ? pageMargins[1] : 0}pt]`]: Array.isArray(pageMargins),
          // [`pr-[${Array.isArray(pageMargins) ? pageMargins[2] : 0}pt]`]: Array.isArray(pageMargins),
          // [`pb-[${Array.isArray(pageMargins) ? pageMargins[3] : 0}pt]`]: Array.isArray(pageMargins),
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
          <MenubarContent className='w-60'>
            <MenubarItem
              disabled={!editor.can().chain().focus().undo().run()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo className='h-4 w-4 mr-2' />Deshacer<MenubarShortcut>Ctrl+Y</MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              disabled={!editor.can().chain().focus().redo().run()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo className='h-4 w-4 mr-2' />Rehacer<MenubarShortcut>Ctrl+Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              <Scissors className='h-4 w-4 mr-2' />Cortar<MenubarShortcut>Ctrl+X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              <Files className='h-4 w-4 mr-2' />Copiar<MenubarShortcut>Ctrl+C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>
              <Clipboard className='h-4 w-4 mr-2' />Pegar<MenubarShortcut>Ctrl+V</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem disabled>
              <TextSelect className='h-4 w-4 mr-2' />Seleccionar todo <MenubarShortcut>Ctrl+A</MenubarShortcut>
            </MenubarItem>
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
              <MenubarSubTrigger>
                <Bold className='h-4 w-4 mr-2' />Texto
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={() => editor.chain().focus().toggleBold().run()}>
                  <Bold className='h-4 w-4 mr-2' />Negrita
                </MenubarItem>
                <MenubarSeparator />
                <Submenu editor={editor} />
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger><AlignJustify className='h-4 w-4 mr-2' />Estilos de párrafo</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarCheckboxItem
                  checked={editor.isActive("paragraph")}
                  disabled={!editor.can().chain().focus().setParagraph().run()}
                  onClick={() => editor.chain().focus().setParagraph().run()}
                >
                  Texto normal
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={editor.isActive("heading", { level: 1 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                  Encabezado 1
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={editor.isActive("heading", { level: 2 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                  Encabezado 2
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={editor.isActive("heading", { level: 3 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                  Encabezado 3
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={editor.isActive("heading", { level: 4 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                >
                  Encabezado 4
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={editor.isActive("heading", { level: 5 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                >
                  Encabezado 5
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={editor.isActive("heading", { level: 6 })}
                  onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                >
                  Encabezado 6
                </MenubarCheckboxItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger><AlignLeft className='h-4 w-4 mr-2' />Alinear</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                  <AlignLeft className="h-4 w-4 mr-2" />Izquierda
                </MenubarItem>
                <MenubarItem onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                  <AlignCenter className="h-4 w-4 mr-2" />Centro
                </MenubarItem>
                <MenubarItem onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                  <AlignRight className="h-4 w-4 mr-2" />Derecha
                </MenubarItem>
                <MenubarItem onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
                  <AlignJustify className="h-4 w-4 mr-2" />Justificado
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger><Sheet className='h-4 w-4 mr-2' />Tabla</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem disabled={!editor.can().addRowBefore()} onClick={() => editor.chain().focus().addRowBefore().run()}>
                  <Plus className='h-4 w-4 mr-2' />Insertar fila arriba
                </MenubarItem>
                <MenubarItem disabled={!editor.can().addRowAfter()} onClick={() => editor.chain().focus().addRowAfter().run()}>
                  <Plus className='h-4 w-4 mr-2' />Insertar fila abajo
                </MenubarItem>
                <MenubarItem disabled={!editor.can().addColumnBefore()} onClick={() => editor.chain().focus().addColumnBefore().run()}>
                  <Plus className='h-4 w-4 mr-2' />Insertar columna a la izquierda
                </MenubarItem>
                <MenubarItem disabled={!editor.can().addColumnAfter()} onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  <Plus className='h-4 w-4 mr-2' />Insertar columna a la derecha
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem disabled={!editor.can().deleteRow()} onClick={() => editor.chain().focus().deleteRow().run()}>
                  <Trash2 className='h-4 w-4 mr-2' />Eliminar fila
                </MenubarItem>
                <MenubarItem disabled={!editor.can().deleteColumn()} onClick={() => editor.chain().focus().deleteColumn().run()}>
                  <Trash2 className='h-4 w-4 mr-2' />Eliminar columna
                </MenubarItem>
                <MenubarItem disabled={!editor.can().deleteTable()} onClick={() => editor.chain().focus().deleteTable().run()}>
                  <Trash2 className='h-4 w-4 mr-2' />Eliminar tabla
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem disabled={!editor.can().mergeCells()} onClick={() => editor.chain().focus().mergeCells().run()}>
                  <TableCellsMerge className='h-4 w-4 mr-2' />Combinar celdas
                </MenubarItem>
                <MenubarItem disabled={!editor.can().splitCell()} onClick={() => editor.chain().focus().splitCell().run()}>
                  <TableCellsSplit className='h-4 w-4 mr-2' />Separar celdas
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem onClick={() => {
              editor.chain().focus().unsetAllMarks().run()
              editor.chain().focus().clearNodes().run()
            }}>
              <RemoveFormatting className='h-4 w-4 mr-2' />Borrar formato
            </MenubarItem>
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