/* eslint-disable no-nested-ternary -- . */
/* eslint-disable @typescript-eslint/no-shadow -- . */
/* eslint-disable react/no-array-index-key -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
/* eslint-disable react-hooks/exhaustive-deps -- . */
'use client'

import React, { useState, useEffect } from 'react'
import { buttonVariants, Button } from '@repo/ui/button'
import { Label } from "@repo/ui/label"
import { FileDown, Check, ChevronsUpDown } from "lucide-react"
import {
  Document,
  Page,
  View,
  Text,
  PDFViewer,
  StyleSheet,
  Image,
  Font,
  PDFDownloadLink
} from '@react-pdf/renderer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"
import { useMediaQuery } from "@repo/ui/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import { Switch } from "@repo/ui/switch"
import { Checkbox } from "@repo/ui/checkbox"
import { Input } from '@repo/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@repo/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/popover"
import { cn } from "@repo/ui/utils"
import { DataTable } from "@/components/participation/data-table"
import { columns } from "@/components/participation/columns"
import {
  processPersons,
  formatResults,
  formatEvents,
  formatDates,
  joinPersons
} from "@/lib/utils"
import type { Data, ParticipantData } from '@/types/types';
import { FileUploader } from "@/components/file-uploader";

Font.register({
  family: 'MavenPro',
  src: '/fonts/MavenPro/MavenPro-Regular.ttf'
})

Font.register({
  family: 'MavenPro-Bold',
  src: '/fonts/MavenPro/MavenPro-Bold.ttf'
})

interface DocumentSettingsProps {
  data: Data;
  city: string;
  state: string;
}

export default function DocumentSettings({ data, city, state }: DocumentSettingsProps): JSX.Element {
  const people = data.persons;
  const events = data.events;
  const date = data.schedule.startDate;
  const days = data.schedule.numberOfDays;

  const { delegates, organizers } = processPersons(people);
  const [pdfData, setPdfData] = useState<ParticipantData[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [background, setBackground] = useState<string>();
  const [size, setSize] = useState<"LETTER" | "A4">();
  const [orientation, setOrientation] = useState<"portrait" | "landscape">();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [customizeText, setCustomizeText] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [fontValue, setFontValue] = useState<string>('Helvetica');

  const [showUpperText, setShowUpperText] = useState<boolean>(true);
  const [showDelegates, setShowDelegates] = useState<boolean>(true);
  const [showOrganizers, setShowOrganizers] = useState<boolean>(true);
  const [onBehalfWCAText, setOnBehalfWCAText] = useState<string>(', en nombre de la World Cube Association, y ');
  const [onBehalfOrganizationTeamText, setOnBehalfOrganizationTeamText] = useState<string>(', en nombre del equipo organizador, otorgan el presente');

  const styles = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 80,
      fontFamily: fontValue === 'Times' ? `${fontValue}-Roman` : `${fontValue}`,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    },
    bold: {
      fontFamily: `${fontValue}-Bold`,
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    icon: {
      width: 12,
      height: 12,
    },
    fontXs: {
      fontSize: 10,
    },
    fontSm: {
      fontSize: 12,
    },
    fontMd: {
      fontSize: 14,
    },
    table: {
      marginTop: 20,
      width: "auto",
      borderStyle: "solid",
      borderWidth: 0,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
      borderBottomWidth: 1,
    },
    tableCol: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 0,
    },
    tableCell: {
      margin: "auto",
      marginVertical: 5,
      textAlign: "left",
    },
    tableHeader: {
      margin: "auto",
      flexDirection: "row",
      textAlign: "left",
      borderBottomWidth: 3,
      borderTopWidth: 0,
    }
  });

  const items = [
    {
      value: "Courier",
      label: "Courier",
    },
    {
      value: "Helvetica",
      label: "Helvetica",
    },
    {
      value: "Times",
      label: "Times",
    },
    {
      value: "MavenPro",
      label: "Maven Pro",
    }
  ]

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
  }

  function generateParticipationCertificates() {
    const filteredResults = allResults.filter(result => rowSelection[result.wcaId]);
    setPdfData(filteredResults);
  }

  useEffect(() => {
    if (size !== undefined && orientation !== undefined && Object.keys(rowSelection).length !== 0) {
      generateParticipationCertificates();
    }
  }, [size, orientation, rowSelection]);

  const participationDocument = (
    <Document author={organizers.join(', ')} title={`Certificados de participación para el ${data.name}`}>
      {pdfData.map((text, index) => (
        <Page key={index} orientation={orientation} size={size}>
          {background ? <Image src={background} style={styles.background} /> : null}
          <View style={[styles.center, styles.body]}>
            {showUpperText ? (
              <Text style={{ fontSize: 14, paddingHorizontal: 40, lineHeight: 1.25 }}>
                {showDelegates ? <Text style={styles.bold}>{joinPersons(delegates)}</Text> : null}
                {onBehalfWCAText}
                {showOrganizers ? <Text style={styles.bold}>{joinPersons(organizers)}</Text> : null}
                {onBehalfOrganizationTeamText}
              </Text>
            ) : null}
            <View style={[styles.bold, { alignItems: 'center', paddingTop: 20, paddingBottom: 10 }]}>
              <Text style={{ fontSize: 40 }}>CERTIFICADO</Text>
              <Text style={{ fontSize: 25 }}>DE PARTICIPACIÓN</Text>
            </View>
            <Text style={{ fontSize: 14 }}>a</Text>
            <Text style={[styles.bold, { fontSize: 35, paddingTop: 10, paddingBottom: 20 }]}>{text.name}</Text>
            <Text style={{ fontSize: 14, paddingHorizontal: 40, lineHeight: 1.25 }}>
              por haber haber participado en el <Text style={styles.bold}>{data.name}</Text>, llevado acabo {days === 1 ? 'el día' : 'los días'} <Text style={styles.bold}>{formatDates(date, days.toString())}</Text> en <Text style={styles.bold}>{city}, {state}</Text>, obteniendo los siguientes resultados:
            </Text>
            <View style={styles.table}>
              <View style={[styles.tableHeader, styles.bold]}>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.fontMd]}>Evento</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.fontMd]}>Resultado</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell, styles.fontMd]}>Posición</Text>
                </View>
              </View>
              {text.results.map((result, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.fontXs]}>{formatEvents(result.event)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.fontXs]}>{formatResults(result.average)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={[styles.tableCell, styles.fontXs, styles.bold]}>{result.ranking}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );

  return (
    <>
      <DataTable columns={columns} data={allResults} rowSelection={rowSelection} setRowSelection={setRowSelection} />
      <div className="text-center mt-4">
        <div className='flex justify-center'>
          <div className='w-full pr-1'>
            <Label>Tamaño de hoja</Label>
            <Select onValueChange={(value: "LETTER" | "A4") => { setSize(value); }}>
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
            <Select onValueChange={(value: "portrait" | "landscape") => { setOrientation(value); }}>
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
          />
        </div>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Switch checked={customizeText} id="upper-text" onCheckedChange={() => { setCustomizeText(!customizeText) }} />
          <Label htmlFor="upper-text">Personalizar texto</Label>
        </div>
        {customizeText ? (
          <div>
            <div className='mb-4'>
              <Label className='pr-4'>Fuente</Label>
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                  <Button
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                    role="combobox"
                    variant="outline"
                  >
                    {fontValue
                      ? items.find((item) => item.value === fontValue)?.label
                      : 'Buscar fuente...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder='Buscar fuente...' />
                    <CommandEmpty>Sin resultados.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {items.map((item) => (
                          <CommandItem
                            key={item.value}
                            onSelect={(currentValue) => {
                              setFontValue(currentValue === fontValue ? "" : currentValue)
                              setOpen(false)
                            }}
                            value={item.value}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                fontValue === item.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {item.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Tabs defaultValue="upper-text">
              <TabsList>
                <TabsTrigger value="upper-text">Texto superior</TabsTrigger>
                <TabsTrigger value="middle-text">Texto medio</TabsTrigger>
                <TabsTrigger value="lower-text">Texto inferior</TabsTrigger>
              </TabsList>
              <TabsContent value="upper-text">
                <div className="flex items-center justify-center space-x-2">
                  <Switch checked={showUpperText} id="upper-text" onCheckedChange={() => { setShowUpperText(!showUpperText) }} />
                  <Label htmlFor="upper-text">Mostrar texto superior</Label>
                </div>
                <div className="flex flex-col sm:flex-row items-center p-4">
                  <div className='flex items-center py-2'>
                    <Checkbox checked={showDelegates} disabled={!showUpperText} id="delegates" onCheckedChange={() => { setShowDelegates(!showDelegates); }} />
                    <Label className='px-2' htmlFor='delegates'>[Delegados]</Label>
                  </div>
                  <Input disabled={!showUpperText} onChange={(e) => { setOnBehalfWCAText(e.target.value); }} value={onBehalfWCAText} />
                  <div className='flex items-center py-2'>
                    <Checkbox checked={showOrganizers} className='ml-2' disabled={!showUpperText} id="organizers" onCheckedChange={() => { setShowOrganizers(!showOrganizers); }} />
                    <Label className='px-2' htmlFor='organizers'>[Organizadores]</Label>
                  </div>
                  <Input disabled={!showUpperText} onChange={(e) => { setOnBehalfOrganizationTeamText(e.target.value); }} value={onBehalfOrganizationTeamText} />
                </div>
              </TabsContent>
              <TabsContent value="middle-text" />
              <TabsContent value="lower-text" />
            </Tabs>
          </div>
        ) : null}
        {Object.keys(rowSelection).length === 0 && <p className='font-semibold'>Debes seleccionar al menos un participante</p>}
        {size === undefined && <p className='font-semibold'>Debes seleccionar el tamaño del documento</p>}
        {orientation === undefined && <p className='font-semibold'>Debes seleccionar la orientación del documento</p>}
        {(size !== undefined && orientation !== undefined && Object.keys(rowSelection).length !== 0) && (
          <>
            {isDesktop ? (
              <PDFViewer className='w-full h-[600px]'>
                {participationDocument}
              </PDFViewer>
            ) : (
              <PDFDownloadLink
                className={buttonVariants()}
                document={participationDocument}
                fileName={`Certificados de participación del ${data.name}`}
              >
                Descargar certificados
                <FileDown className='ml-2' />
              </PDFDownloadLink>
            )}
          </>
        )}
      </div>
    </>
  );
}
