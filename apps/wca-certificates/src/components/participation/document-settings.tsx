/* eslint-disable no-nested-ternary -- . */
/* eslint-disable @typescript-eslint/no-shadow -- . */
/* eslint-disable react/no-array-index-key -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
/* eslint-disable react-hooks/exhaustive-deps -- . */
'use client'

import React, { useState, useEffect } from 'react'
import { toast } from "sonner"
import { buttonVariants } from '@repo/ui/button'
import { Label } from "@repo/ui/label"
import { FileDown } from "lucide-react"
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
import { Input } from '@repo/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@repo/ui/card'
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
import { Combobox } from "@/components/combobox-font";
import { CardCustomText, CardFixedText } from "@/components/card-document-settings";

Font.register({
  family: 'MavenPro',
  src: '/fonts/MavenPro/MavenPro-Regular.ttf'
})

Font.register({
  family: 'MavenPro-Bold',
  src: '/fonts/MavenPro/MavenPro-Bold.ttf'
})

Font.registerHyphenationCallback(word => [word]);

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface TextSettings {
  text: string | boolean;
  fontSize: number;
  fontFamily: string;
  margin: Margin;
  color: string;
}

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
  const [debugDocument, setDebugDocument] = useState<boolean>(false);

  if (debugDocument) {
    toast.error("Desactiva esta opción antes de imprimir o descargar el documento.")
  }

  const [fontFamily, setFontFamily] = useState<string>('Helvetica');
  const [color, setColor] = useState<string>('#000000');
  const [margins, setMargins] = useState<Margin>({ top: 0, right: 80, bottom: 0, left: 80 });

  const [showUpperText, setShowUpperText] = useState<boolean>(true);
  const [upperMargins, setUpperMargins] = useState<Margin>({ top: 0, right: 0, bottom: 0, left: 0 });
  const [upperText1, setUpperText1] = useState<TextSettings>({
    text: true,
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [upperText2, setUpperText2] = useState<TextSettings>({
    text: ', en nombre de la World Cube Association, y ',
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [upperText3, setUpperText3] = useState<TextSettings>({
    text: true,
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [upperText4, setUpperText4] = useState<TextSettings>({
    text: ', en nombre del equipo organizador, otorgan el presente',
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });

  const [showMiddleText, setShowMiddleText] = useState<boolean>(true);
  const [middleText1, setMiddleText1] = useState<TextSettings>({
    text: 'CERTIFICADO',
    fontSize: 40,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [middleText2, setMiddleText2] = useState<TextSettings>({
    text: 'DE PARTICIPACIÓN',
    fontSize: 25,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [middleText3, setMiddleText3] = useState<TextSettings>({
    text: 'a',
    fontSize: 14,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [middleText4, setMiddleText4] = useState<TextSettings>({
    text: true,
    fontSize: 35,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });

  const [showLowerText, setShowLowerText] = useState<boolean>(true);
  const [lowerMargins, setLowerMargins] = useState<Margin>({ top: 0, right: 0, bottom: 0, left: 0 });
  const [lowerText1, setLowerText1] = useState<TextSettings>({
    text: 'por haber haber participado en el ',
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [lowerText2, setLowerText2] = useState<TextSettings>({
    text: true,
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [lowerText3, setLowerText3] = useState<TextSettings>({
    text: `, llevado acabo ${days === 1 ? 'el día ' : 'los días '}`,
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [lowerText4, setLowerText4] = useState<TextSettings>({
    text: true,
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [lowerText5, setLowerText5] = useState<TextSettings>({
    text: ' en ',
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [lowerText6, setLowerText6] = useState<TextSettings>({
    text: true,
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [lowerText7, setLowerText7] = useState<TextSettings>({
    text: ', obteniendo los siguientes resultados:',
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });

  const [showTable, setShowTable] = useState<boolean>(true);
  const [tableMargins, setTableMargins] = useState<Margin>({ top: 0, right: 0, bottom: 0, left: 0 });
  const [tableText1, setTableText1] = useState<TextSettings>({
    text: 'Evento',
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [tableText2, setTableText2] = useState<TextSettings>({
    text: 'Resultado',
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [tableText3, setTableText3] = useState<TextSettings>({
    text: 'Posición',
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [tableText4, setTableText4] = useState<TextSettings>({
    text: true,
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [tableText5, setTableText5] = useState<TextSettings>({
    text: true,
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [tableText6, setTableText6] = useState<TextSettings>({
    text: true,
    fontSize: 12,
    fontFamily,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    color
  });
  const [eventsFormat, setEventsFormat] = useState<'og' | 'es'>();

  const styles = StyleSheet.create({
    body: {
      marginTop: margins.top,
      marginRight: margins.right,
      marginBottom: margins.bottom,
      marginLeft: margins.left,
      fontFamily,
      color
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    table: {
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
          <View debug={debugDocument} style={[styles.center, styles.body]}>
            {showUpperText ? (
              <Text debug={debugDocument} style={{
                marginTop: upperMargins.top,
                marginRight: upperMargins.right,
                marginBottom: upperMargins.bottom,
                marginLeft: upperMargins.left
              }}>
                {upperText1.text ? (
                  <Text style={{
                    fontSize: upperText1.fontSize,
                    fontFamily: upperText1.fontFamily,
                    color: upperText1.color,
                    marginTop: upperText1.margin.top,
                    marginRight: upperText1.margin.right,
                    marginBottom: upperText1.margin.bottom,
                    marginLeft: upperText1.margin.left
                  }}>
                    {joinPersons(delegates)}
                  </Text>
                ) : null}
                {upperText2.text ? (
                  <Text style={{
                    fontSize: upperText2.fontSize,
                    fontFamily: upperText2.fontFamily,
                    color: upperText2.color,
                    marginTop: upperText2.margin.top,
                    marginRight: upperText2.margin.right,
                    marginBottom: upperText2.margin.bottom,
                    marginLeft: upperText2.margin.left
                  }}>
                    {upperText2.text}
                  </Text>
                ) : null}
                {upperText3.text ? (
                  <Text style={{
                    fontSize: upperText3.fontSize,
                    fontFamily: upperText3.fontFamily,
                    color: upperText3.color,
                    marginTop: upperText3.margin.top,
                    marginRight: upperText3.margin.right,
                    marginBottom: upperText3.margin.bottom,
                    marginLeft: upperText3.margin.left
                  }}>
                    {joinPersons(organizers)}
                  </Text>
                ) : null}
                {upperText4.text ? (
                  <Text style={{
                    fontSize: upperText4.fontSize,
                    fontFamily: upperText4.fontFamily,
                    color: upperText4.color,
                    marginTop: upperText4.margin.top,
                    marginRight: upperText4.margin.right,
                    marginBottom: upperText4.margin.bottom,
                    marginLeft: upperText4.margin.left
                  }}>
                    {upperText4.text}
                  </Text>
                ) : null}
              </Text>
            ) : null}
            {showMiddleText ? (
              <>
                {typeof middleText1.text === 'string' && middleText1.text.length !== 0 ? (
                  <Text
                    debug={debugDocument}
                    style={{
                      fontSize: middleText1.fontSize,
                      fontFamily: middleText1.fontFamily,
                      color: middleText1.color,
                      marginTop: middleText1.margin.top,
                      marginRight: middleText1.margin.right,
                      marginBottom: middleText1.margin.bottom,
                      marginLeft: middleText1.margin.left,
                    }}>
                    {middleText1.text}
                  </Text>
                ) : null}
                {typeof middleText2.text === 'string' && middleText2.text.length !== 0 ? (
                  <Text
                    debug={debugDocument}
                    style={{
                      fontSize: middleText2.fontSize,
                      fontFamily: middleText2.fontFamily,
                      color: middleText2.color,
                      marginTop: middleText2.margin.top,
                      marginRight: middleText2.margin.right,
                      marginBottom: middleText2.margin.bottom,
                      marginLeft: middleText2.margin.left,
                    }}>
                    {middleText2.text}
                  </Text>
                ) : null}
                {typeof middleText3.text === 'string' && middleText3.text.length !== 0 ? (
                  <Text
                    debug={debugDocument}
                    style={{
                      fontSize: middleText3.fontSize,
                      fontFamily: middleText3.fontFamily,
                      color: middleText3.color,
                      marginTop: middleText3.margin.top,
                      marginRight: middleText3.margin.right,
                      marginBottom: middleText3.margin.bottom,
                      marginLeft: middleText3.margin.left,
                    }}>
                    {middleText3.text}
                  </Text>
                ) : null}
                {middleText4.text ? (
                  <Text
                    debug={debugDocument}
                    style={{
                      fontSize: middleText4.fontSize,
                      fontFamily: middleText4.fontFamily,
                      color: middleText4.color,
                      marginTop: middleText4.margin.top,
                      marginRight: middleText4.margin.right,
                      marginBottom: middleText4.margin.bottom,
                      marginLeft: middleText4.margin.left,
                    }}>
                    {text.name}
                  </Text>
                ) : null}
              </>
            ) : null}
            {showLowerText ? (
              <Text debug={debugDocument} style={{
                marginTop: lowerMargins.top,
                marginRight: lowerMargins.right,
                marginBottom: lowerMargins.bottom,
                marginLeft: lowerMargins.left
              }}>
                {lowerText1.text ? (
                  <Text style={{
                    fontSize: lowerText1.fontSize,
                    fontFamily: lowerText1.fontFamily,
                    color: lowerText1.color,
                    marginTop: lowerText1.margin.top,
                    marginRight: lowerText1.margin.right,
                    marginBottom: lowerText1.margin.bottom,
                    marginLeft: lowerText1.margin.left
                  }}>
                    {lowerText1.text}
                  </Text>
                ) : null}
                {lowerText2.text ? (
                  <Text style={{
                    fontSize: lowerText2.fontSize,
                    fontFamily: lowerText2.fontFamily,
                    color: lowerText2.color,
                    marginTop: lowerText2.margin.top,
                    marginRight: lowerText2.margin.right,
                    marginBottom: lowerText2.margin.bottom,
                    marginLeft: lowerText2.margin.left
                  }}>
                    {data.name}
                  </Text>
                ) : null}
                {lowerText3.text ? (
                  <Text style={{
                    fontSize: lowerText3.fontSize,
                    fontFamily: lowerText3.fontFamily,
                    color: lowerText3.color,
                    marginTop: lowerText3.margin.top,
                    marginRight: lowerText3.margin.right,
                    marginBottom: lowerText3.margin.bottom,
                    marginLeft: lowerText3.margin.left
                  }}>
                    {lowerText3.text}
                  </Text>
                ) : null}
                {lowerText4.text ? (
                  <Text style={{
                    fontSize: lowerText4.fontSize,
                    fontFamily: lowerText4.fontFamily,
                    color: lowerText4.color,
                    marginTop: lowerText4.margin.top,
                    marginRight: lowerText4.margin.right,
                    marginBottom: lowerText4.margin.bottom,
                    marginLeft: lowerText4.margin.left
                  }}>
                    {formatDates(date, days.toString())}
                  </Text>
                ) : null}
                {lowerText5.text ? (
                  <Text style={{
                    fontSize: lowerText5.fontSize,
                    fontFamily: lowerText5.fontFamily,
                    color: lowerText5.color,
                    marginTop: lowerText5.margin.top,
                    marginRight: lowerText5.margin.right,
                    marginBottom: lowerText5.margin.bottom,
                    marginLeft: lowerText5.margin.left
                  }}>
                    {lowerText5.text}
                  </Text>
                ) : null}
                {lowerText6.text ? (
                  <Text style={{
                    fontSize: lowerText6.fontSize,
                    fontFamily: lowerText6.fontFamily,
                    color: lowerText6.color,
                    marginTop: lowerText6.margin.top,
                    marginRight: lowerText6.margin.right,
                    marginBottom: lowerText6.margin.bottom,
                    marginLeft: lowerText6.margin.left
                  }}>
                    {city}, {state}
                  </Text>
                ) : null}
                {lowerText7.text ? (
                  <Text style={{
                    fontSize: lowerText7.fontSize,
                    fontFamily: lowerText7.fontFamily,
                    color: lowerText7.color,
                    marginTop: lowerText7.margin.top,
                    marginRight: lowerText7.margin.right,
                    marginBottom: lowerText7.margin.bottom,
                    marginLeft: lowerText7.margin.left
                  }}>
                    {lowerText7.text}
                  </Text>
                ) : null}
              </Text>
            ) : null}
            {showTable ? (
              <View debug={debugDocument} style={[styles.table, {
                marginTop: tableMargins.top,
                marginRight: tableMargins.right,
                marginBottom: tableMargins.bottom,
                marginLeft: tableMargins.left
              }]}>
                <View style={[styles.tableHeader]}>
                  {typeof tableText1.text === 'string' && tableText1.text.length !== 0 ? (
                    <View style={styles.tableCol}>
                      <Text
                        style={
                          [styles.tableCell, {
                            fontSize: tableText1.fontSize,
                            fontFamily: tableText1.fontFamily,
                            color: tableText1.color
                          }]
                        }>
                        {tableText1.text}
                      </Text>
                    </View>
                  ) : null}
                  {typeof tableText2.text === 'string' && tableText2.text.length !== 0 ? (
                    <View style={styles.tableCol}>
                      <Text
                        style={
                          [styles.tableCell, {
                            fontSize: tableText2.fontSize,
                            fontFamily: tableText2.fontFamily,
                            color: tableText2.color
                          }]
                        }>
                        {tableText2.text}
                      </Text>
                    </View>
                  ) : null}
                  {typeof tableText3.text === 'string' && tableText3.text.length !== 0 ? (
                    <View style={styles.tableCol}>
                      <Text
                        style={
                          [styles.tableCell, {
                            fontSize: tableText3.fontSize,
                            fontFamily: tableText3.fontFamily,
                            color: tableText3.color
                          }]
                        }>
                        {tableText3.text}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {text.results.map((result, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    {tableText4.text ? (
                      <View style={styles.tableCol}>
                        <Text
                          style={
                            [styles.tableCell, {
                              fontSize: tableText4.fontSize,
                              fontFamily: tableText4.fontFamily,
                              color: tableText4.color
                            }]
                          }>
                          {formatEvents(result.event, eventsFormat)}
                        </Text>
                      </View>
                    ) : null}
                    {tableText5.text ? (
                      <View style={styles.tableCol}>
                        <Text
                          style={
                            [styles.tableCell, {
                              fontSize: tableText5.fontSize,
                              fontFamily: tableText5.fontFamily,
                              color: tableText5.color
                            }]
                          }>
                          {formatResults(result.average)}
                        </Text>
                      </View>
                    ) : null}
                    {tableText6.text ? (
                      <View style={styles.tableCol}>
                        <Text
                          style={
                            [styles.tableCell, {
                              fontSize: tableText6.fontSize,
                              fontFamily: tableText6.fontFamily,
                              color: tableText6.color
                            }]
                          }>
                          {result.ranking}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </Page>
      ))}
    </Document>
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={allResults}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
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
        {(size !== undefined && orientation !== undefined && Object.keys(rowSelection).length !== 0) && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Switch checked={customizeText} id="upper-text" onCheckedChange={() => { setCustomizeText(!customizeText) }} />
            <Label htmlFor="upper-text">Personalizar documento</Label>
          </div>
        )}
        {customizeText ? (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Documento</CardTitle>
                <CardDescription>Personalización general</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Fuente</Label>
                    <div className='my-2'>
                      <Combobox
                        setValue={(newFontFamily) => {
                          setFontFamily(newFontFamily);
                          setUpperText1(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setUpperText2(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setUpperText3(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setUpperText4(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setMiddleText1(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setMiddleText2(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setMiddleText3(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setMiddleText4(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setLowerText1(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setLowerText2(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setLowerText3(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setLowerText4(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setLowerText5(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setLowerText6(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setLowerText7(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setTableText1(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setTableText2(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setTableText3(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setTableText4(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setTableText5(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                          setTableText6(prevText => ({ ...prevText, fontFamily: newFontFamily }));
                        }}
                        value={fontFamily}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor='color'>Color</Label>
                    <Input
                      className='my-2 !p-0 !border-0'
                      id='color'
                      onChange={(e) => {
                        setColor(e.target.value);
                        setUpperText1(prevText => ({ ...prevText, color: e.target.value }));
                        setUpperText2(prevText => ({ ...prevText, color: e.target.value }));
                        setUpperText3(prevText => ({ ...prevText, color: e.target.value }));
                        setUpperText4(prevText => ({ ...prevText, color: e.target.value }));
                        setMiddleText1(prevText => ({ ...prevText, color: e.target.value }));
                        setMiddleText2(prevText => ({ ...prevText, color: e.target.value }));
                        setMiddleText3(prevText => ({ ...prevText, color: e.target.value }));
                        setMiddleText4(prevText => ({ ...prevText, color: e.target.value }));
                        setLowerText1(prevText => ({ ...prevText, color: e.target.value }));
                        setLowerText2(prevText => ({ ...prevText, color: e.target.value }));
                        setLowerText3(prevText => ({ ...prevText, color: e.target.value }));
                        setLowerText4(prevText => ({ ...prevText, color: e.target.value }));
                        setLowerText5(prevText => ({ ...prevText, color: e.target.value }));
                        setLowerText6(prevText => ({ ...prevText, color: e.target.value }));
                        setLowerText7(prevText => ({ ...prevText, color: e.target.value }));
                        setTableText1(prevText => ({ ...prevText, color: e.target.value }));
                        setTableText2(prevText => ({ ...prevText, color: e.target.value }));
                        setTableText3(prevText => ({ ...prevText, color: e.target.value }));
                        setTableText4(prevText => ({ ...prevText, color: e.target.value }));
                        setTableText5(prevText => ({ ...prevText, color: e.target.value }));
                        setTableText6(prevText => ({ ...prevText, color: e.target.value }));
                      }}
                      type='color'
                      value={color}
                    />
                  </div>
                </div>
                <div className='grid grid-cols-4 gap-4 my-4'>
                  <div>
                    <Label htmlFor="margin-top">Margen superior</Label>
                    <Input
                      id='margin-top'
                      min={0}
                      onChange={(e) => {
                        setMargins(prevMargins => ({ ...prevMargins, top: parseInt(e.target.value, 10) }));
                      }}
                      type='number'
                      value={margins.top}
                    />
                  </div>
                  <div>
                    <Label htmlFor="margin-right">Margen derecho</Label>
                    <Input
                      id='margin-right'
                      min={0}
                      onChange={(e) => {
                        setMargins(prevMargins => ({ ...prevMargins, right: parseInt(e.target.value, 10) }));
                      }}
                      type='number'
                      value={margins.right}
                    />
                  </div>
                  <div>
                    <Label htmlFor="margin-bottom">Margen inferior</Label>
                    <Input
                      id='margin-bottom'
                      min={0}
                      onChange={(e) => {
                        setMargins(prevMargins => ({ ...prevMargins, bottom: parseInt(e.target.value, 10) }));
                      }}
                      type='number'
                      value={margins.bottom}
                    />
                  </div>
                  <div>
                    <Label htmlFor="margin-left">Margen izquierdo</Label>
                    <Input
                      id='margin-left'
                      min={0}
                      onChange={(e) => {
                        setMargins(prevMargins => ({ ...prevMargins, left: parseInt(e.target.value, 10) }));
                      }}
                      type='number'
                      value={margins.left}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Switch checked={debugDocument} id="debug" onCheckedChange={() => { setDebugDocument(!debugDocument) }} />
                  <Label htmlFor="debug">Ver espaciado</Label>
                </div>
              </CardContent>
            </Card>
            <Tabs className='mt-4' defaultValue="upper-text">
              <TabsList>
                <TabsTrigger value="upper-text">Superior</TabsTrigger>
                <TabsTrigger value="middle-text">Medio</TabsTrigger>
                <TabsTrigger value="lower-text">Inferior</TabsTrigger>
                <TabsTrigger value="table">Tabla</TabsTrigger>
              </TabsList>
              <TabsContent value="upper-text">
                <Card>
                  <CardHeader>
                    <CardTitle>Texto superior</CardTitle>
                    <CardDescription>Información de quién entrega el certificado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center space-x-2">
                      <Switch checked={showUpperText} id="upper-text" onCheckedChange={() => { setShowUpperText(!showUpperText) }} />
                      <Label htmlFor="upper-text">Mostrar texto</Label>
                    </div>
                    <div className='grid grid-cols-4 gap-4 my-4'>
                      <div>
                        <Label htmlFor="upper-margin-top">Margen superior</Label>
                        <Input
                          disabled={!showUpperText}
                          id='upper-margin-top'
                          min={0}
                          onChange={(e) => {
                            setUpperMargins(prevMargins => ({ ...prevMargins, top: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={upperMargins.top}
                        />
                      </div>
                      <div>
                        <Label htmlFor="upper-margin-right">Margen derecho</Label>
                        <Input
                          disabled={!showUpperText}
                          id='upper-margin-right'
                          min={0}
                          onChange={(e) => {
                            setUpperMargins(prevMargins => ({ ...prevMargins, right: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={upperMargins.right}
                        />
                      </div>
                      <div>
                        <Label htmlFor="upper-margin-bottom">Margen inferior</Label>
                        <Input
                          disabled={!showUpperText}
                          id='upper-margin-bottom'
                          min={0}
                          onChange={(e) => {
                            setUpperMargins(prevMargins => ({ ...prevMargins, bottom: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={upperMargins.bottom}
                        />
                      </div>
                      <div>
                        <Label htmlFor="upper-margin-left">Margen izquierdo</Label>
                        <Input
                          disabled={!showUpperText}
                          id='upper-margin-left'
                          min={0}
                          onChange={(e) => {
                            setUpperMargins(prevMargins => ({ ...prevMargins, left: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={upperMargins.left}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CardFixedText
                        allowMargin={false}
                        certificateTextSettings={upperText1}
                        description='Delegado 1, Delegado 2, Delegado 3, ...'
                        id='upper-text-1'
                        setCertificateTextSettings={setUpperText1}
                        showText={showUpperText}
                        title='Delegados'
                      />
                      <CardCustomText
                        allowMargin={false}
                        certificateTextSettings={upperText2}
                        description='en nombre de la WCA...'
                        id='upper-text-2'
                        setCertificateTextSettings={setUpperText2}
                        showText={showUpperText}
                        title='Texto 1'
                      />
                      <CardFixedText
                        allowMargin={false}
                        certificateTextSettings={upperText3}
                        description='Organizador 1, Organizador 2, Organizador 3, ...'
                        id='upper-text-3'
                        setCertificateTextSettings={setUpperText3}
                        showText={showUpperText}
                        title='Organizadores'
                      />
                      <CardCustomText
                        allowMargin={false}
                        certificateTextSettings={upperText4}
                        description='en nombre de la organización...'
                        id='upper-text-4'
                        setCertificateTextSettings={setUpperText4}
                        showText={showUpperText}
                        title='Texto 2'
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="middle-text">
                <Card>
                  <CardHeader>
                    <CardTitle>Texto medio</CardTitle>
                    <CardDescription>Información del competidor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center space-x-2">
                      <Switch checked={showMiddleText} id="upper-text" onCheckedChange={() => { setShowMiddleText(!showMiddleText) }} />
                      <Label htmlFor="upper-text">Mostrar texto</Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <CardCustomText
                        certificateTextSettings={middleText1}
                        description='Certificado/Constancia/Reconocimiento'
                        id='middle-text-1'
                        setCertificateTextSettings={setMiddleText1}
                        showText={showMiddleText}
                        title='Título'
                      />
                      <CardCustomText
                        certificateTextSettings={middleText2}
                        description='De participación'
                        id='middle-text-2'
                        setCertificateTextSettings={setMiddleText2}
                        showText={showMiddleText}
                        title='Subtítulo'
                      />
                      <CardCustomText
                        certificateTextSettings={middleText3}
                        description='a'
                        id='middle-text-3'
                        setCertificateTextSettings={setMiddleText3}
                        showText={showMiddleText}
                        title='Conector'
                      />
                      <CardFixedText
                        certificateTextSettings={middleText4}
                        description='Nombre completo'
                        id='middle-text-4'
                        setCertificateTextSettings={setMiddleText4}
                        showText={showMiddleText}
                        title='Competidor'
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="lower-text">
                <Card>
                  <CardHeader>
                    <CardTitle>Texto inferior</CardTitle>
                    <CardDescription>Información de la competencia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center space-x-2">
                      <Switch checked={showLowerText} id="upper-text" onCheckedChange={() => { setShowLowerText(!showLowerText) }} />
                      <Label htmlFor="upper-text">Mostrar texto</Label>
                    </div>
                    <div className='grid grid-cols-4 gap-4 my-4'>
                      <div>
                        <Label htmlFor="lower-margin-top">Margen superior</Label>
                        <Input
                          disabled={!showLowerText}
                          id='lower-margin-top'
                          min={0}
                          onChange={(e) => {
                            setLowerMargins(prevMargins => ({ ...prevMargins, top: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={lowerMargins.top}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lower-margin-right">Margen derecho</Label>
                        <Input
                          disabled={!showLowerText}
                          id='lower-margin-right'
                          min={0}
                          onChange={(e) => {
                            setLowerMargins(prevMargins => ({ ...prevMargins, right: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={lowerMargins.right}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lower-margin-bottom">Margen inferior</Label>
                        <Input
                          disabled={!showLowerText}
                          id='lower-margin-bottom'
                          min={0}
                          onChange={(e) => {
                            setLowerMargins(prevMargins => ({ ...prevMargins, bottom: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={lowerMargins.bottom}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lower-margin-left">Margen izquierdo</Label>
                        <Input
                          disabled={!showLowerText}
                          id='lower-margin-left'
                          min={0}
                          onChange={(e) => {
                            setLowerMargins(prevMargins => ({ ...prevMargins, left: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={lowerMargins.left}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CardCustomText
                        allowMargin={false}
                        certificateTextSettings={lowerText1}
                        description='Por haber participado...'
                        id='lower-text-1'
                        setCertificateTextSettings={setLowerText1}
                        showText={showLowerText}
                        title='Texto 1'
                      />
                      <CardFixedText
                        allowMargin={false}
                        certificateTextSettings={lowerText2}
                        description='Nombre de la competencia'
                        id='lower-text-2'
                        setCertificateTextSettings={setLowerText2}
                        showText={showLowerText}
                        title='Competencia'
                      />
                      <CardCustomText
                        allowMargin={false}
                        certificateTextSettings={lowerText3}
                        description={`Llevado acabo ${days === 1 ? 'el día' : 'los días'}...`}
                        id='lower-text-3'
                        setCertificateTextSettings={setLowerText3}
                        showText={showLowerText}
                        title='Texto 2'
                      />
                      <CardFixedText
                        allowMargin={false}
                        certificateTextSettings={lowerText4}
                        description={`${days === 1 ? 'Día' : 'Días'} de la competencia`}
                        id='lower-text-4'
                        setCertificateTextSettings={setLowerText4}
                        showText={showLowerText}
                        title='Fecha'
                      />
                      <CardCustomText
                        allowMargin={false}
                        certificateTextSettings={lowerText5}
                        description='en...'
                        id='lower-text-5'
                        setCertificateTextSettings={setLowerText5}
                        showText={showLowerText}
                        title='Texto 3'
                      />
                      <CardFixedText
                        allowMargin={false}
                        certificateTextSettings={lowerText6}
                        description='Ciudad, Estado'
                        id='lower-text-6'
                        setCertificateTextSettings={setLowerText6}
                        showText={showLowerText}
                        title='Ubicación'
                      />
                      <CardCustomText
                        allowMargin={false}
                        certificateTextSettings={lowerText7}
                        description='Obteniendo los siguientes resultados...'
                        id='lower-text-7'
                        setCertificateTextSettings={setLowerText7}
                        showText={showLowerText}
                        title='Texto 4'
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="table">
                <Card>
                  <CardHeader>
                    <CardTitle>Tabla de resultados</CardTitle>
                    <CardDescription>Resultados del competidor por evento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center space-x-2">
                      <Switch checked={showTable} id="results-table" onCheckedChange={() => { setShowTable(!showTable) }} />
                      <Label htmlFor="results-table">Mostrar tabla</Label>
                    </div>
                    <div className='grid grid-cols-4 gap-4 my-4'>
                      <div>
                        <Label htmlFor="table-margin-top">Margen superior</Label>
                        <Input
                          disabled={!showTable}
                          id='table-margin-top'
                          min={0}
                          onChange={(e) => {
                            setTableMargins(prevMargins => ({ ...prevMargins, top: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={tableMargins.top}
                        />
                      </div>
                      <div>
                        <Label htmlFor="table-margin-right">Margen derecho</Label>
                        <Input
                          disabled={!showTable}
                          id='table-margin-right'
                          min={0}
                          onChange={(e) => {
                            setTableMargins(prevMargins => ({ ...prevMargins, right: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={tableMargins.right}
                        />
                      </div>
                      <div>
                        <Label htmlFor="table-margin-bottom">Margen inferior</Label>
                        <Input
                          disabled={!showTable}
                          id='table-margin-bottom'
                          min={0}
                          onChange={(e) => {
                            setTableMargins(prevMargins => ({ ...prevMargins, bottom: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={tableMargins.bottom}
                        />
                      </div>
                      <div>
                        <Label htmlFor="table-margin-left">Margen izquierdo</Label>
                        <Input
                          disabled={!showTable}
                          id='table-margin-left'
                          min={0}
                          onChange={(e) => {
                            setTableMargins(prevMargins => ({ ...prevMargins, left: parseInt(e.target.value, 10) }));
                          }}
                          type='number'
                          value={tableMargins.left}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <CardCustomText
                        allowMargin={false}
                        certificateTextSettings={tableText1}
                        description='Evento/Categoría'
                        id='results-table-1'
                        setCertificateTextSettings={setTableText1}
                        showText={showTable}
                        title='Encabezado 1'
                      />
                      <CardCustomText
                        allowMargin={false}
                        certificateTextSettings={tableText2}
                        description='Resultado/Tiempo'
                        id='results-table-2'
                        setCertificateTextSettings={setTableText2}
                        showText={showTable}
                        title='Encabezado 2'
                      />
                      <CardCustomText
                        allowMargin={false}
                        certificateTextSettings={tableText3}
                        description='Posición/Clasificación/Ranking'
                        id='results-table-3'
                        setCertificateTextSettings={setTableText3}
                        showText={showTable}
                        title='Encabezado 3'
                      />
                      <CardFixedText
                        allowMargin={false}
                        certificateTextSettings={tableText4}
                        description='Evento/Categoría'
                        id='results-table-4'
                        setCertificateTextSettings={setTableText4}
                        showText={showTable}
                        title='Columna 1'
                      >
                        <div className='grid grid-cols-1 gap-4'>
                          <Label htmlFor='events-format'>Formato</Label>
                          <Select onValueChange={(value: 'og' | 'es') => {
                            setEventsFormat(value);
                          }}>
                            <SelectTrigger id='events-format'>
                              <SelectValue placeholder="Formato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="og">Original</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardFixedText>
                      <CardFixedText
                        allowMargin={false}
                        certificateTextSettings={tableText5}
                        description='Resultado/Tiempo'
                        id='results-table-5'
                        setCertificateTextSettings={setTableText5}
                        showText={showTable}
                        title='Columna 2'
                      />
                      <CardFixedText
                        allowMargin={false}
                        certificateTextSettings={tableText6}
                        description='Posición/Clasificación/Ranking'
                        id='results-table-6'
                        setCertificateTextSettings={setTableText6}
                        showText={showTable}
                        title='Columna 3'
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
        {Object.keys(rowSelection).length === 0 && <p className='font-semibold'>Debes seleccionar al menos un participante</p>}
        {size === undefined && <p className='font-semibold'>Debes seleccionar el tamaño del documento</p>}
        {orientation === undefined && <p className='font-semibold'>Debes seleccionar la orientación del documento</p>}
        {(size !== undefined && orientation !== undefined && Object.keys(rowSelection).length !== 0) && (
          <div className='mt-4'>
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
          </div>
        )}
      </div>
    </>
  );
}
