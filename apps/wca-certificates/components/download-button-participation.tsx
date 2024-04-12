'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileDown } from "lucide-react"
import { processPersons, formatResults, formatEvents, formatDates } from "@/lib/utils"
import { Document, Page, View, Text, PDFViewer, StyleSheet, Image, Font } from '@react-pdf/renderer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  data: any;
  city: string;
  state: string;
}

export default function DownloadButton({ data, city, state }: DownloadButtonProps) {
  const { delegates, organizers, getEventData } = processPersons(data.persons);
  const [pdfData, setPdfData] = useState<Array<string[]>>([]);
  const [inputValue, setInputValue] = useState('');
  const [size, setSize] = useState<"LETTER" | "A4">();
  const [orientation, setOrientation] = useState<"portrait" | "landscape">();

  const date = data.schedule.startDate;
  const days = data.schedule.numberOfDays;

  function handleClick() {

    const people = data.persons;
    const events = data.events;

    let allResults: Array<string[]> = [];

    for (let person of people) {
      let results = [];
      for (let event of events) {
        if (person.registration.eventIds.includes(event.id)) {
          for (let round of event.rounds) {
            for (let result of round.results) {
              if (result.personId === person.registrantId) {
                const existingResultIndex = results.findIndex(r => r.event === event.id) as any;
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
        name: person.name,
        results: results
      };

      if (personWithResults.results.length > 0) {
        allResults.push(personWithResults as any);
      }
    }

    setPdfData(allResults);
  }

  const MyDoc = (
    <Document title={`Certificados de participación para el ${data.name}`} author={organizers}>
      {pdfData.map((text: any, index) => (
        <Page key={index} orientation={orientation} size={size}>
          {inputValue && <Image src={inputValue} style={styles.background} />}
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
              por haber haber participado en el <Text style={styles.bold}>{data.name}</Text>, llevado acabo {days === 1 ? 'el día' : 'los días'} <Text style={styles.bold}>{formatDates(date, days)}</Text> en <Text style={styles.bold}>{city}, {state}</Text>, obteniendo los siguientes resultados:
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
              {text.results.map((result: any, index: number) => (
                <View style={styles.tableRow} key={index}>
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
          <Select onValueChange={(value: "LETTER" | "A4") => setSize(value)}>
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
          <Select onValueChange={(value: "portrait" | "landscape") => setOrientation(value)}>
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
        <Input placeholder="Fondo" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className='my-4' />
      </div>
      <Button onClick={() => handleClick()} disabled={size === undefined || orientation === undefined}>
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