'use client'

import React, { useState } from 'react'
import { Button } from '@repo/ui/button'
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { FileDown } from "lucide-react"
import { processPersons, formatResults, formatEvents, formatPlace, formatMedal, formatResultType, formatDates } from "@/lib/utils"
import { Document, Page, View, Text, PDFViewer, StyleSheet, Image, Font } from '@react-pdf/renderer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"

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
  // customFont: {
  //   fontFamily: 'MavenPro-Bold',
  // }
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
    const tempPdfData: Array<string[]> = [];

    data.events.map((event: any) => {
      const results = getEventData(event);

      results.map((result: any, index: number) => {
        tempPdfData.push(Object.values({
          personName: result.personName,
          place: index + 1,
          eventName: event.id,
          result: result.result,
        }).map(String));
      });
    });

    setPdfData(tempPdfData);
  }

  const MyDoc = (
    <Document title={`Certificados de podio para el ${data.name}`} author={organizers}>
      {pdfData.map((text, index) => (
        <Page key={index} orientation={orientation} size={size}>
          {inputValue && <Image src={inputValue} style={styles.background} />}
          <View style={[styles.center, styles.body]}>
            <Text style={{ fontSize: 16, paddingHorizontal: 40, lineHeight: 1.25 }}>
              <Text style={styles.bold}>{delegates}</Text>, en nombre de la World Cube Association, y <Text style={styles.bold}>{organizers}</Text>, en nombre del equipo organizador, otorgan el presente
            </Text>
            <View style={[styles.bold, { alignItems: 'center', paddingTop: 20, paddingBottom: 10 }]}>
              <Text style={{ fontSize: 40 }}>CERTIFICADO</Text>
              <Text style={{ fontSize: 25 }}>DE MEDALLA DE {formatMedal(text[1])}</Text>
            </View>
            <Text style={{ fontSize: 16 }}>a</Text>
            <Text style={[styles.bold, { fontSize: 35, paddingTop: 10, paddingBottom: 20 }]}>{text[0]}</Text>
            <Text style={{ fontSize: 16, paddingHorizontal: 40, lineHeight: 1.25 }}>
              por haber obtenido el <Text style={styles.bold}>{formatPlace(text[1])} lugar</Text> en <Text style={styles.bold}>{formatEvents(text[2])}</Text> con {formatResultType(text[2])} de <Text style={styles.bold}>{formatResults(text[3])}</Text> en el <Text style={styles.bold}>{data.name}</Text>, llevado acabo { days === 1 ? 'el día' : 'los días' } <Text style={styles.bold}>{ formatDates(date, days) }</Text> en <Text style={styles.bold}>{ city }, { state }</Text>.
            </Text>
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
