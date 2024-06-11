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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import * as pdfMake from "pdfmake/build/pdfmake";
import type { Margins, PageOrientation, PageSize, TDocumentDefinitions } from 'pdfmake/interfaces';
import { useMediaQuery } from '@repo/ui/use-media-query';
import type { Event, Competition, PodiumData } from '@/types/wca-live';
import {
  processPersons,
  formatResults,
  formatEvents,
  formatPlace,
  formatDates,
  joinPersons,
  transformString
} from "@/lib/utils"
import { columns } from "@/app/certificates/podium/[competitionId]/_components/columns"
import { DataTable } from "@/app/certificates/podium/[competitionId]/_components/data-table"
import { FileUploader } from "@/components/file-uploader";
import { podium } from '@/lib/placeholders';
import Tiptap from '@/components/editor/tiptap'

const fonts = {
  'Roboto': {
    normal: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/Roboto/Roboto-Regular.ttf`,
    bold: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/Roboto/Roboto-Bold.ttf`,
    italics: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/Roboto/Roboto-Regular.ttf`,
    bolditalics: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/Roboto/Roboto-Regular.ttf`
  },
  'Maven Pro': {
    normal: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/MavenPro/MavenPro-Regular.ttf`,
    bold: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/MavenPro/MavenPro-Bold.ttf`,
    italics: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/MavenPro/MavenPro-Regular.ttf`,
    bolditalics: `${process.env.NEXT_PUBLIC_APP_URL}/fonts/MavenPro/MavenPro-Regular.ttf`
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
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [files, setFiles] = useState<File[]>([]);
  const [background, setBackground] = useState<string>();

  const [content, setContent] = useState<JSONContent>(podium);

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
      const fontSize = contentItem.marks?.find(mark => mark.type === 'textStyle')?.attrs?.fontSize as string;
      const color = contentItem.marks?.find(mark => mark.type === 'textStyle')?.attrs?.color;
      const transform = contentItem.marks?.find(mark => mark.type === 'textStyle')?.attrs?.transform as 'lowercase' | 'capitalize' | 'uppercase' | 'none';

      const textObject = (text: string | undefined) => ({
        text,
        bold,
        font,
        fontSize: parseInt(fontSize) * 1.039,
        color
      });

      switch (contentItem.type) {
        case 'text':
          return bold || font || fontSize || color ? textObject(transformString(contentItem.text || '', transform)) : transformString(contentItem.text || '', transform);
        case 'mention':
          switch (contentItem.attrs?.id) {
            case 'Delegados':
              return bold || font || fontSize || color ? textObject(transformString(joinPersons(delegates), transform)) : transformString(joinPersons(delegates), transform);
            case 'Organizadores':
              return bold || font || fontSize || color ? textObject(transformString(joinPersons(organizers), transform)) : transformString(joinPersons(organizers), transform);
            case 'Posición (cardinal)':
              return bold || font || fontSize || color ? textObject(transformString(formatPlace(data.place, 'cardinal'), transform)) : transformString(formatPlace(data.place, 'cardinal'), transform);
            case 'Posición (ordinal)':
              return bold || font || fontSize || color ? textObject(transformString(formatPlace(data.place, 'ordinal'), transform)) : transformString(formatPlace(data.place, 'ordinal'), transform);
            case 'Posición (ordinal con texto)':
              return bold || font || fontSize || color ? textObject(transformString(formatPlace(data.place, 'ordinal_text'), transform)) : transformString(formatPlace(data.place, 'ordinal_text'), transform);
            case 'Medalla':
              return bold || font || fontSize || color ? textObject(transformString(formatPlace(data.place, 'medal'), transform)) : transformString(formatPlace(data.place, 'medal'), transform);
            case 'Competidor':
              return bold || font || fontSize || color ? textObject(transformString(data.name, transform)) : transformString(data.name, transform);
            case 'Evento':
              return bold || font || fontSize || color ? textObject(transformString(formatEvents(data.event), transform)) : transformString(formatEvents(data.event), transform);
            case 'Resultado':
              return bold || font || fontSize || color ? textObject(transformString(formatResults(data.result, data.event), transform)) : transformString(formatResults(data.result, data.event), transform);
            case 'Competencia':
              return bold || font || fontSize || color ? textObject(transformString(competition.name, transform)) : transformString(competition.name, transform);
            case 'Fecha':
              return bold || font || fontSize || color ? textObject(transformString(formatDates(date, days.toString()), transform)) : transformString(formatDates(date, days.toString()), transform);
            case 'Ciudad':
              return bold || font || fontSize || color ? textObject(transformString(`${city}, ${state}`, transform)) : transformString(`${city}, ${state}`, transform);
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

    pdfMake.createPdf(docDefinition, undefined, fonts).open();
  }

  return (
    <Tabs defaultValue="results">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="results">Resultados</TabsTrigger>
        <TabsTrigger value="document">Documento</TabsTrigger>
      </TabsList>
      <TabsContent value="results">
        <DataTable
          columns={columns}
          data={competition.events}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </TabsContent>
      <TabsContent value="document">
        {isDesktop ? (
          <div className='mt-4'>
            <form
              className="grid place-items-center my-4"
              onSubmit={handleSubmit}
            >
              <Tiptap
                content={content}
                key={`${pageSize}-${pageOrientation}-${pageMargins}`}
                onChange={(newContent: JSONContent) => { handleContentChange(newContent); }}
                pageMargins={pageMargins}
                pageOrientation={pageOrientation}
                pageSize={pageSize}
                setPageMargins={(value: Margins) => { setPageMargins(value); }}
                setPageOrientation={(value: PageOrientation) => { setPageOrientation(value); }}
                setPageSize={(value: PageSize) => { setPageSize(value); }}
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
        ) : (
          <div className='text-center'>
            De momento el editor de texto no está disponible en dispositivos móviles. Por favor, utiliza un dispositivo de escritorio.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
