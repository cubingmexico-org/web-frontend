/* eslint-disable @typescript-eslint/restrict-template-expressions -- . */
/* eslint-disable @typescript-eslint/no-base-to-string -- . */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
/* eslint-disable @typescript-eslint/no-shadow -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */

'use client'

import React, { useState, useEffect } from 'react'
import type { JSONContent } from '@tiptap/react'
import { Button } from "@repo/ui/button"
import { Label } from "@repo/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@repo/ui/select';
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group"
import { Input } from '@repo/ui/input';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { Margins, PageOrientation, PageSize, TDocumentDefinitions } from 'pdfmake/interfaces';
import { FileText } from 'lucide-react';
import { FileUploader } from "@/components/file-uploader";
import { podium } from '@/lib/placeholders';
import Tiptap from './editor/tiptap'

const vfs = pdfFonts.pdfMake.vfs

const fonts = {
  'Roboto': {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Bold.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-BoldItalic.ttf'
  },
  'Maven Pro': {
    normal: 'MavenPro-Regular.ttf',
    bold: 'MavenPro-Bold.ttf',
    italics: 'MavenPro-Regular.ttf',
    bolditalics: 'MavenPro-Regular.ttf'
  },
}

export default function DocumentForm(): JSX.Element {

  const [pageMargins, setPageMargins] = useState<Margins>([40, 60, 40, 60]);
  const [pageOrientation, setPageOrientation] = useState<PageOrientation>("portrait");
  const [pageSize, setPageSize] = useState<PageSize>("LETTER");

  const [files, setFiles] = useState<File[]>([]);
  const [background, setBackground] = useState<string>();

  useEffect(() => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackground(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setBackground(undefined);
    }
  }, [files]);

  const [content, setContent] = useState<JSONContent>(podium)

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
  }

  const handleContentChange = (content: JSONContent) => {
    setContent(content)
  }

  const renderContent = (content: JSONContent) => {
    return content.content?.map((item) => {
      const alignment = item.attrs?.textAlign || 'left';
      switch (item.type) {
        case 'paragraph':
          return {
            text: renderTextContent(item.content),
            style: 'paragraph',
            alignment
          };
        case 'heading':
          return {
            text: renderTextContent(item.content),
            style: `header${item.attrs?.level}`,
            alignment
          };
        default:
          return null;
      }
    }).filter(Boolean);
  };

  const renderTextContent = (content: JSONContent['content']) => {
    return content?.map((contentItem) => {
      const bold = contentItem.marks?.some(mark => mark.type === 'bold');
      const font = contentItem.marks?.find(mark => mark.type === 'textStyle')?.attrs?.fontFamily;

      const textObject = (text: string | undefined) => ({
        text,
        bold,
        font,
      });

      switch (contentItem.type) {
        case 'text':
          return bold || font ? textObject(contentItem.text) : contentItem.text;
        case 'mention':
          switch (contentItem.attrs?.id) {
            case 'Delegados':
              return bold || font ? textObject(getDelegatesNames()) : getDelegatesNames();
            case 'Organizadores':
              return bold || font ? textObject(getOrganizersNames()) : getOrganizersNames();
            case 'Lugar':
              return bold || font ? textObject('Tercer Lugar') : 'Tercer Lugar';
            case 'Competidor':
              return bold || font ? textObject('Leonardo Sánchez Del Toro') : 'Leonardo Sánchez Del Toro';
            case 'Evento':
              return bold || font ? textObject('Megaminx') : 'Megaminx';
            case 'Resultado':
              return bold || font ? textObject('49.00') : '49.00';
            case 'Competencia':
              return bold || font ? textObject('Nayar Open 2024') : 'Nayar Open 2024';
            case 'Fecha':
              return bold || font ? textObject('23 y 24 de marzo de 2024') : '23 y 24 de marzo de 2024';
            case 'Ciudad':
              return bold || font ? textObject('Tepic, Nayarit') : 'Tepic, Nayarit';
            default:
              return null;
          }
        default:
          return null;
      }
    }).filter(Boolean);
  };

  const getDelegatesNames = (): string => {
    return 'Alice';
  };

  const getOrganizersNames = (): string => {
    return 'Bob';
  };

  const generatePDF = () => {
    const docDefinition = {
      content: renderContent(content),
      background(currentPage, pageSize) {
        if (background) {
          return {
            image: background,
            width: pageSize.width,
            height: pageSize.height
          }
        }
        return null;
      },
      pageMargins,
      pageOrientation,
      pageSize,
      styles: {
        header1: {
          fontSize: 24
        },
        header2: {
          fontSize: 20
        },
        header3: {
          fontSize: 18
        },
        paragraph: {
          fontSize: 12
        }
      },
      language: 'es'
    } as TDocumentDefinitions;

    pdfMake.createPdf(docDefinition, undefined, fonts, vfs).open();
  }

  return (
    <div>
      <div className='flex justify-center'>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline'><FileText className='h-5 w-5 mr-2' /> Configuración de página</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configuración de página</DialogTitle>
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='pageOrientation'>Orientación</Label>
                    <RadioGroup className='flex' defaultValue="portrait" id='pageOrientation' onValueChange={(value: PageOrientation) => { setPageOrientation(value); }} value={pageOrientation}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="portrait" value="portrait" />
                        <Label htmlFor="portrait">Vertical</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="landscape" value="landscape" />
                        <Label htmlFor="landscape">Horizontal</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='pageSize'>Tamaño de papel</Label>
                    <Select onValueChange={(value: string) => { setPageSize(value as PageSize); }} value={pageSize as string}>
                      <SelectTrigger className="w-full" id='pageSize'>
                        <SelectValue placeholder="Tamaño *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LETTER">Carta (21.6 cm x 27.9 cm)</SelectItem>
                        <SelectItem value="A4">A4 (21 cm x 29.7 cm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='pageMargins'>Márgenes</Label>
                  <div className='grid items-center grid-cols-2 gap-2'>
                    <Label htmlFor='top'>Superior</Label>
                    <Input
                      className='w-full'
                      id='top'
                      min={0}
                      onChange={(e) => {
                        if (Array.isArray(pageMargins) && pageMargins.length === 4) {
                          setPageMargins([
                            pageMargins[0],
                            parseInt(e.target.value),
                            pageMargins[2],
                            pageMargins[3]
                          ]);
                        }
                      }}
                      type='number'
                      value={Array.isArray(pageMargins) && pageMargins.length === 4 ? pageMargins[1] : 0}
                    />
                    <Label htmlFor='bottom'>Inferior</Label>
                    <Input
                      className='w-full'
                      id='bottom'
                      min={0}
                      onChange={(e) => {
                        if (Array.isArray(pageMargins) && pageMargins.length === 4) {
                          setPageMargins([
                            pageMargins[0],
                            pageMargins[1],
                            pageMargins[2],
                            parseInt(e.target.value)
                          ]);
                        }
                      }}
                      type='number'
                      value={Array.isArray(pageMargins) && pageMargins.length === 4 ? pageMargins[3] : 0}
                    />
                    <Label htmlFor='right'>Derecho</Label>
                    <Input
                      className='w-full'
                      id='right'
                      min={0}
                      onChange={(e) => {
                        if (Array.isArray(pageMargins) && pageMargins.length === 4) {
                          setPageMargins([
                            pageMargins[0],
                            pageMargins[1],
                            parseInt(e.target.value),
                            pageMargins[3]
                          ]);
                        }
                      }}
                      type='number'
                      value={Array.isArray(pageMargins) && pageMargins.length === 4 ? pageMargins[2] : 0}
                    />
                    <Label htmlFor='left'>Izquierdo</Label>
                    <Input
                      className='w-full'
                      id='left'
                      min={0}
                      onChange={(e) => {
                        if (Array.isArray(pageMargins) && pageMargins.length === 4) {
                          setPageMargins([
                            parseInt(e.target.value),
                            pageMargins[1],
                            pageMargins[2],
                            pageMargins[3]
                          ]);
                        }
                      }}
                      type='number'
                      value={Array.isArray(pageMargins) && pageMargins.length === 4 ? pageMargins[0] : 0}
                    />
                  </div>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className='my-4'>
        <Label htmlFor='background'>Fondo</Label>
        <FileUploader
          id='background'
          maxFiles={1}
          maxSize={1 * 1024 * 1024}
          onValueChange={(e) => { setFiles(e); }}
          value={files}
        />
      </div>
      <form
        className="grid place-items-center"
        onSubmit={handleSubmit}
      >
        <Tiptap
          key={`${pageSize}-${pageOrientation}-${pageMargins}`}
          onChange={(newContent: JSONContent) => { handleContentChange(newContent); }}
          pageMargins={pageMargins}
          pageOrientation={pageOrientation}
          pageSize={pageSize}
        />

        <Button onClick={generatePDF} type="submit">Generar PDF</Button>
      </form>
    </div>
  )
}