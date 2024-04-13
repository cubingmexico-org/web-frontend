'use client'

import React, { useState } from 'react'
import { Button } from '@repo/ui/button'
import { Input } from "@repo/ui/input"
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
  Font
} from '@react-pdf/renderer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"
import {
  processPersons,
  formatResults,
  formatEvents,
  formatDates
} from "@/lib/utils"
import type { Data } from '@/types/types';

interface Result {
  event: string;
  average: number;
  ranking: number;
};

interface PdfData {
  name: string;
  results: Result[];
};

Font.register({
  family: 'MavenPro',
  src: '/fonts/MavenPro/MavenPro-Regular.ttf'
})

Font.register({
  family: 'MavenPro-Bold',
  src: '/fonts/MavenPro/MavenPro-Bold.ttf'
})

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 80,
    fontFamily: 'MavenPro',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  bold: {
    fontFamily: 'MavenPro-Bold',
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
interface DownloadButtonProps {
  data: Data;
  city: string;
  state: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- This function has different return types
export default function DownloadButton({ data, city, state }: DownloadButtonProps) {
  const { delegates, organizers } = processPersons(data.persons);
  const [pdfData, setPdfData] = useState<PdfData[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [size, setSize] = useState<"LETTER" | "A4">();
  const [orientation, setOrientation] = useState<"portrait" | "landscape">();

  const date = data.schedule.startDate;
  const days = data.schedule.numberOfDays;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- This function has different return types
  function handleClick() {

    const people = data.persons;
    const events = data.events;

    const allResults = [];

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
                  // eslint-disable-next-line no-nested-ternary -- This is a nested ternary
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
        name: person.name,
        results
      };

      if (personWithResults.results.length > 0) {
        allResults.push(personWithResults);
      }
    }

    setPdfData(allResults);
  }

  const MyDoc = (
    <Document author={organizers.join(', ')} title={`Certificados de participación para el ${data.name}`}>
      {pdfData.map((text, index) => (
        // eslint-disable-next-line react/no-array-index-key -- This array will not change
        <Page key={index} orientation={orientation} size={size}>
          {inputValue ? <Image src={inputValue} style={styles.background} /> : null}
          <View style={[styles.center, styles.body]}>
            <Text style={{ fontSize: 14, paddingHorizontal: 40, lineHeight: 1.25 }}>
              <Text style={styles.bold}>{delegates}</Text>, en nombre de la World Cube Association, y <Text style={styles.bold}>{organizers}</Text>, en nombre del equipo organizador, otorgan el presente
            </Text>
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
              {/* eslint-disable-next-line @typescript-eslint/no-shadow -- . */}
              {text.results.map((result, index: number) => (
                // eslint-disable-next-line react/no-array-index-key -- This array will not change
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
      <div className='mt-4'>
        <Label>Fondo</Label>
        <Input className='my-4' onChange={(e) => { setInputValue(e.target.value); }} placeholder="Fondo" value={inputValue} />
      </div>
      <Button disabled={size === undefined || orientation === undefined} onClick={() => { handleClick(); }}>
        Generar certificados
        <FileDown className='ml-2' />
      </Button>
      {pdfData.length > 0 && (
        <PDFViewer className='w-full h-[600px] mt-4'>
          {MyDoc}
        </PDFViewer>
      )}
    </div>
  );
}
