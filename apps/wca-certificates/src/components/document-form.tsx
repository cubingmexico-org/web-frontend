/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
/* eslint-disable @typescript-eslint/no-shadow -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */

'use client'

import React, { useState, useEffect } from 'react'
import type { JSONContent } from '@tiptap/react'
import { Button } from "@repo/ui/button"
import { Label } from "@repo/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
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


  const [pageSize, setPageSize] = useState<"LETTER" | "A4">("LETTER");
  const [pageOrientation, setPageOrientation] = useState<"portrait" | "landscape">("portrait");
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
      const isBold = contentItem.marks?.some(mark => mark.type === 'bold');
      const fontFamily = contentItem.marks?.find(mark => mark.type === 'textStyle')?.attrs?.fontFamily;

      const textObject = (text: string | undefined) => ({
        text,
        bold: isBold,
        font: fontFamily,
      });

      switch (contentItem.type) {
        case 'text':
          return isBold || fontFamily ? textObject(contentItem.text) : contentItem.text;
        case 'mention':
          switch (contentItem.attrs?.id) {
            case 'Delegados':
              return isBold || fontFamily ? textObject(getDelegatesNames()) : getDelegatesNames();
            case 'Organizadores':
              return isBold || fontFamily ? textObject(getOrganizersNames()) : getOrganizersNames();
            case 'Lugar':
              return isBold || fontFamily ? textObject('Tercer Lugar') : 'Tercer Lugar';
            case 'Competidor':
              return isBold || fontFamily ? textObject('Leonardo Sánchez Del Toro') : 'Leonardo Sánchez Del Toro';
            case 'Evento':
              return isBold || fontFamily ? textObject('Megaminx') : 'Megaminx';
            case 'Resultado':
              return isBold || fontFamily ? textObject('49.00') : '49.00';
            case 'Competencia':
              return isBold || fontFamily ? textObject('Nayar Open 2024') : 'Nayar Open 2024';
            case 'Fecha':
              return isBold || fontFamily ? textObject('23 y 24 de marzo de 2024') : '23 y 24 de marzo de 2024';
            case 'Ciudad':
              return isBold || fontFamily ? textObject('Tepic, Nayarit') : 'Tepic, Nayarit';
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
      pageOrientation,
      pageSize,
      pageMargins: [40, 60, 40, 60],
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
      background (currentPage, pageSize) {
        if (background) {
          return {
            image: background,
            width: pageSize.width,
            height: pageSize.height
          }
        }
        return null;
      },
    } as TDocumentDefinitions;

    pdfMake.createPdf(docDefinition, undefined, fonts, vfs).open();
  }

  return (
    <div>
      <div className='flex justify-center'>
        <div className='w-full pr-1'>
          <Label>Tamaño de hoja</Label>
          <Select onValueChange={(value: "LETTER" | "A4") => { setPageSize(value); }} value={pageSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tamaño *" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LETTER">Carta</SelectItem>
              <SelectItem value="A4">A4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='w-full pl-1'>
          <Label>Orientación de hoja</Label>
          <Select onValueChange={(value: "portrait" | "landscape") => { setPageOrientation(value); }} value={pageOrientation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Orientación *" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="landscape">Horizontal</SelectItem>
              <SelectItem value="portrait">Vertical</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        className="grid place-items-center mx-auto pt-10 mb-10"
        onSubmit={handleSubmit}
      >
        <Tiptap onChange={(newContent: JSONContent) => { handleContentChange(newContent); }} />

        <Button onClick={generatePDF} type="submit">Generar PDF</Button>
      </form>
    </div>
  )
}