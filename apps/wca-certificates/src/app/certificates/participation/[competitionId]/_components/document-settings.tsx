/* eslint-disable @typescript-eslint/no-explicit-any -- . */
/* eslint-disable @typescript-eslint/no-unsafe-return -- . */
/* eslint-disable no-nested-ternary -- . */
/* eslint-disable react-hooks/exhaustive-deps -- . */
/* eslint-disable @typescript-eslint/restrict-template-expressions -- . */
/* eslint-disable @typescript-eslint/no-base-to-string -- . */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */
/* eslint-disable @typescript-eslint/no-shadow -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
'use client'

import React, { useState, useEffect } from 'react'
import type { JSONContent } from '@tiptap/react';
import { Label } from "@repo/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import * as pdfMake from "pdfmake/build/pdfmake";
import type { Margins, PageOrientation, PageSize, TDocumentDefinitions } from 'pdfmake/interfaces';
import { useMediaQuery } from '@repo/ui/use-media-query';
import type { Competition, ParticipantData } from '@/types/wca-live';
import {
  processPersons,
  formatDates,
  joinPersons,
  transformString,
  formatEvents,
  formatResults
} from "@/lib/utils"
import { columns } from "@/app/certificates/participation/[competitionId]/_components/columns"
import { DataTable } from "@/app/certificates/participation/[competitionId]/_components/data-table"
import { FileUploader } from "@/components/file-uploader";
import { participation } from '@/lib/placeholders';
import Tiptap from '@/components/editor/tiptap'
import { fontDeclarations } from '@/lib/fonts';

interface DocumentSettingsProps {
  competition: Competition;
  city: string;
  state: string;
}

export default function DocumentSettings({ competition, city, state }: DocumentSettingsProps): JSX.Element {

  const people = competition.persons;
  const events = competition.events;
  const date = competition.schedule.startDate;
  const days = competition.schedule.numberOfDays;

  const { delegates, organizers } = processPersons(competition.persons);
  const [pdfData, setPdfData] = useState<ParticipantData[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [pageMargins, setPageMargins] = useState<Margins>([40, 60, 40, 60]);
  const [pageOrientation, setPageOrientation] = useState<PageOrientation>("portrait");
  const [pageSize, setPageSize] = useState<PageSize>("LETTER");
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [files, setFiles] = useState<File[]>([]);
  const [background, setBackground] = useState<string>();

  const [content, setContent] = useState<JSONContent>(participation);

  useEffect(() => {
    if (Object.keys(rowSelection).length !== 0) {
      generateParticipationCertificates();
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

  const allResults: ParticipantData[] = [];

  for (const person of people) {
    const results = [];
    for (const event of events) {
      if (person.registration.eventIds.includes(event.id)) {
        for (const round of event.rounds) {
          for (const result of round.results) {
            if (result.personId === person.registrantId) {
              const existingResultIndex: number = results.findIndex(r => r.event === event.id);
              const newResult = {
                event: event.id,
                ranking: result.ranking,
                average: event.id === '333bf' ? result.best : result.average === 0 ? result.best : result.average,
              };
              if (existingResultIndex !== -1) {
                results[existingResultIndex] = newResult;
              } else {
                results.push(newResult);
              }
            }
          }
        }
      }
    }

    const personWithResults = {
      wcaId: person.wcaId,
      name: person.name,
      results
    };

    if (personWithResults.results.length > 0) {
      allResults.push(personWithResults);
    }
  };

  function generateParticipationCertificates() {
    const filteredResults = allResults.filter(result => rowSelection[result.wcaId]);
    setPdfData(filteredResults);
  };

  const renderDocumentContent = (content: JSONContent, data: ParticipantData): any => {
    return content.content?.map((item) => {
      const text = item.content && item.content.length > 0 ? renderTextContent(item.content, data) : '\u00A0';
      const alignment = item.attrs?.textAlign || 'left';
      switch (item.type) {
        case 'paragraph':
          return {
            text,
            style: 'paragraph',
            alignment
          };
        case 'heading':
          return {
            text,
            style: `header${item.attrs?.level}`,
            alignment
          };
        case 'table':
          return {
            columns: [
              { width: '*', text: '' },
              {
                table: {
                  headerRows: 1,
                  // widths: item.attrs?.widths,
                  body: [
                    ...(item.content || []).map(row => {
                      const headerCells = row.content?.filter(cell => cell.type === 'tableHeader') || [];
                      if (row.type === 'tableRow') {
                        if (headerCells.length === 0) {
                          return null;
                        }
                        return headerCells.map(cell => cell.content?.map((contentCell) => renderDocumentContent({ content: [contentCell] }, data)));
                      }
                      return null;
                    }).filter(Boolean),
                    ...(item.content?.some(row => row.content?.some(cell => cell.type === 'tableCell')) ? data.results.map(result => {

                      const cell = item.content?.find(row => row.content?.some(cell => cell.type === 'tableCell'));

                      let event;
                      let average;
                      let ranking;

                      for (const row of cell?.content || []) {
                        for (const cell of row.content || []) {
                          if (cell.content?.some(content => content.type === 'mention')) {
                            switch (cell.content[0].attrs?.id) {
                              case 'Evento (tabla)':
                                event = renderDocumentContent({
                                  content: [
                                    {
                                      type: 'paragraph',
                                      attrs: cell.attrs,
                                      content: [
                                        {
                                          type: 'text',
                                          text: formatEvents(result.event),
                                          marks: cell.content[0].marks
                                        }
                                      ]
                                    }
                                  ]
                                }, data);
                                break;
                              case 'Resultado (tabla)':
                                average = renderDocumentContent({
                                  content: [
                                    {
                                      type: 'paragraph',
                                      attrs: cell.attrs,
                                      content: [
                                        {
                                          type: 'text',
                                          text: formatResults(result.average, result.event),
                                          marks: cell.content[0].marks
                                        }
                                      ]
                                    }
                                  ]
                                }, data);
                                break;
                              case 'Posición (tabla)':
                                ranking = renderDocumentContent({
                                  content: [
                                    {
                                      type: 'paragraph',
                                      attrs: cell.attrs,
                                      content: [
                                        {
                                          type: 'text',
                                          text: (result.ranking || '').toString(),
                                          marks: cell.content[0].marks
                                        }
                                      ]
                                    }
                                  ]
                                }, data);
                                break;
                              default:
                                break;
                            }
                          }
                        }
                      }

                      return [event || {}, average || {}, ranking || {}]
                    }) : [])
                  ]
                },
                width: 'auto'
              },
              { width: '*', text: '' },
            ]
          };
        default:
          return null;
      }
    }).filter(Boolean);
  };

  const renderTextContent = (content: JSONContent['content'], data: ParticipantData) => {
    return content?.map((contentItem) => {
      const bold = contentItem.marks?.some(mark => mark.type === 'bold');
      const font = contentItem.marks?.find(mark => mark.type === 'textStyle')?.attrs?.fontFamily || 'Roboto';
      const fontSize = contentItem.marks?.find(mark => mark.type === 'textStyle')?.attrs?.fontSize || '12pt';
      const color = contentItem.marks?.find(mark => mark.type === 'textStyle')?.attrs?.color || '#000000';
      const transform = contentItem.marks?.find(mark => mark.type === 'textStyle')?.attrs?.transform as 'lowercase' | 'capitalize' | 'uppercase' | 'none' | undefined || 'none';

      const textObject = (text: string | undefined) => ({
        text,
        bold,
        font,
        fontSize: parseInt(fontSize as string) * 1.039,
        color
      });

      switch (contentItem.type) {
        case 'text':
          return textObject(transformString(contentItem.text || '', transform));
        case 'mention':
          switch (contentItem.attrs?.id) {
            case 'Delegados':
              return textObject(transformString(joinPersons(delegates), transform));
            case 'Organizadores':
              return textObject(transformString(joinPersons(organizers), transform));
            case 'Competidor':
              return textObject(transformString(data.name, transform));
            case 'Competencia':
              return textObject(transformString(competition.name, transform));
            case 'Fecha':
              return textObject(transformString(formatDates(date, days.toString()), transform));
            case 'Ciudad':
              return textObject(transformString(`${city}, ${state}`, transform));
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
      info: {
        title: `Certificados de Participación - ${competition.name}`,
        author: 'Cubing México',
      },
      content: pdfData.map((data, index) => ({
        stack: renderDocumentContent(content, data),
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

    pdfMake.createPdf(docDefinition, undefined, fontDeclarations).open();
  };

  return (
    <Tabs defaultValue="results">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="results">Resultados</TabsTrigger>
        <TabsTrigger value="document">Documento</TabsTrigger>
      </TabsList>
      <TabsContent value="results">
        <DataTable
          columns={columns}
          data={allResults}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </TabsContent>
      <TabsContent value="document">
        {isDesktop ? (
          <div className='mt-4'>
            <form
              className="grid place-items-center my-4"
              onSubmit={(e) => { e.preventDefault(); }}
            >
              <Tiptap
                content={content}
                key={`${pageSize}-${pageOrientation}-${pageMargins}`}
                onChange={(newContent: JSONContent) => { setContent(newContent); }}
                pageMargins={pageMargins}
                pageOrientation={pageOrientation}
                pageSize={pageSize}
                pdfDisabled={Object.keys(rowSelection).length === 0}
                pdfOnClick={generatePDF}
                setPageMargins={(value: Margins) => { setPageMargins(value); }}
                setPageOrientation={(value: PageOrientation) => { setPageOrientation(value); }}
                setPageSize={(value: PageSize) => { setPageSize(value); }}
                variant='participation'
              />
            </form>
            <div>
              <Label htmlFor='background'>Fondo del certificado</Label>
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
