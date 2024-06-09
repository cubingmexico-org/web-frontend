/* eslint-disable react-hooks/exhaustive-deps -- . */
/* eslint-disable array-callback-return -- . */
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
import type { Event, Competition, PodiumData } from '@/types/wca-live';
import {
  processPersons,
  formatResults,
  formatEvents,
  formatPlace,
  formatDates,
  joinPersons,
} from "@/lib/utils"
import { columns } from "@/components/podium/columns"
import { DataTable } from "@/components/podium/data-table"
import { FileUploader } from "@/components/file-uploader";
import { podium } from '@/lib/placeholders';
import Tiptap from '../editor/tiptap'

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

interface DocumentSettingsProps {
  competition: Competition;
  city: string;
  state: string;
}

export default function DocumentSettings({ competition, city, state }: DocumentSettingsProps): JSX.Element {

  const date = competition.schedule.startDate;
  const days = competition.schedule.numberOfDays;

  const { delegates, organizers, getEventData } = processPersons(competition.persons);
  const [pdfData, setPdfData] = useState<PodiumData[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [pageMargins, setPageMargins] = useState<Margins>([40, 60, 40, 60]);
  const [pageOrientation, setPageOrientation] = useState<PageOrientation>("landscape");
  const [pageSize, setPageSize] = useState<PageSize>("LETTER");

  const [files, setFiles] = useState<File[]>([]);
  const [background, setBackground] = useState<string>();

  const selectedEvents = competition.events.filter(event => rowSelection[event.id]);

  function generatePodiumCertificates() {
    const tempPdfData: PodiumData[] = [];

    selectedEvents.map((event: Event) => {
      const results = getEventData(event);

      results.map((result, index: number) => {
        tempPdfData.push({
          name: result.personName,
          place: index + 1,
          event: event.id,
          result: result.result,
        });
      });
    });

    setPdfData(tempPdfData);
  }

  useEffect(() => {
    if (Object.keys(rowSelection).length !== 0) {
      generatePodiumCertificates();
    }
  }, [rowSelection]);

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

  const renderContent = (content: JSONContent, data: PodiumData) => {
    return content.content?.map((item) => {
      const alignment = item.attrs?.textAlign || 'left';
      const textContent = item.content && item.content.length > 0 ? renderTextContent(item.content, data) : '\u00A0';
      switch (item.type) {
        case 'paragraph':
          return {
            text: textContent,
            style: 'paragraph',
            alignment
          };
        case 'heading':
          return {
            text: renderTextContent(item.content, data),
            style: `header${item.attrs?.level}`,
            alignment
          };
        default:
          return null;
      }
    }).filter(Boolean);
  };

  const renderTextContent = (content: JSONContent['content'], data: PodiumData) => {
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
              return bold || font ? textObject(joinPersons(delegates)) : joinPersons(delegates);
            case 'Organizadores':
              return bold || font ? textObject(joinPersons(organizers)) : joinPersons(organizers);
            case 'Lugar':
              return bold || font ? textObject(formatPlace(data.place, 'medal')) : formatPlace(data.place, 'medal');
            case 'Competidor':
              return bold || font ? textObject(data.name) : data.name;
            case 'Evento':
              return bold || font ? textObject(formatEvents(data.event)) : formatEvents(data.event);
            case 'Resultado':
              return bold || font ? textObject(formatResults(data.result, data.event)) : formatResults(data.result, data.event);
            case 'Competencia':
              return bold || font ? textObject(competition.name) : competition.name;
            case 'Fecha':
              return bold || font ? textObject(formatDates(date, days.toString())) : formatDates(date, days.toString());
            case 'Ciudad':
              return bold || font ? textObject(`${city}, ${state}`) : `${city}, ${state}`;
            default:
              return null;
          }
        default:
          return null;
      }
    }).filter(Boolean);
  };

  const generatePDF = () => {
    const docDefinition = {
      content: pdfData.map((data, index) => ({
        stack: renderContent(content, data),
        pageBreak: index < pdfData.length - 1 ? 'after' : ''
      })),
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
          fontSize: 33.231,
          lineHeight: 1
        },
        header2: {
          fontSize: 24.923,
          lineHeight: 1
        },
        header3: {
          fontSize: 20.769,
          lineHeight: 1
        },
        header4: {
          fontSize: 16.615,
          lineHeight: 1
        },
        header5: {
          fontSize: 14.538,
          lineHeight: 1
        },
        header6: {
          fontSize: 12.462,
          lineHeight: 1
        },
        paragraph: {
          fontSize: 12.462,
          lineHeight: 1
        }
      },
      language: 'es'
    } as TDocumentDefinitions;

    pdfMake.createPdf(docDefinition, undefined, fonts, vfs).open();
  }

  return (
    <>
      <DataTable columns={columns} data={competition.events} rowSelection={rowSelection} setRowSelection={setRowSelection} />
      <div className='mt-4'>
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
                        disabled
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
                        disabled
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
                        disabled
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
                        disabled
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
        <form
          className="grid place-items-center my-4"
          onSubmit={handleSubmit}
        >
          <Tiptap
            key={`${pageSize}-${pageOrientation}-${pageMargins}`}
            onChange={(newContent: JSONContent) => { handleContentChange(newContent); }}
            pageMargins={pageMargins}
            pageOrientation={pageOrientation}
            pageSize={pageSize}
          />

          <Button disabled={Object.keys(rowSelection).length === 0} onClick={generatePDF} type="submit">Generar PDF</Button>
        </form>
        <div>
          <Label htmlFor='background'>Fondo</Label>
          <FileUploader
            id='background'
            maxFiles={1}
            maxSize={1 * 1024 * 1024}
            onValueChange={(e) => { setFiles(e); }}
            value={files}
          />
        </div>
      </div>
    </>
  );
}
