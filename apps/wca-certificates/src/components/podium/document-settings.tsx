/* eslint-disable react/no-array-index-key -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
/* eslint-disable react-hooks/exhaustive-deps -- . */
/* eslint-disable array-callback-return -- . */
'use client'

import React, { useState, useEffect } from 'react'
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
import { DataTable } from "@/components/podium/data-table"
import { columns } from "@/components/podium/columns"
import {
  processPersons,
  formatResults,
  formatEvents,
  formatPlace,
  formatMedal,
  formatResultType,
  formatDates,
  joinPersons
} from "@/lib/utils"
import { FileUploader } from "@/components/file-uploader";
import type { Event, Data } from '@/types/types';

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

interface DocumentSettingsProps {
  data: Data;
  city: string;
  state: string;
}

export default function DocumentSettings({ data, city, state }: DocumentSettingsProps): JSX.Element {
  const { delegates, organizers, getEventData } = processPersons(data.persons);
  const [pdfData, setPdfData] = useState<string[][]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [background, setBackground] = useState<string>();
  const [size, setSize] = useState<"LETTER" | "A4">();
  const [orientation, setOrientation] = useState<"portrait" | "landscape">();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const date = data.schedule.startDate;
  const days = data.schedule.numberOfDays;

  const selectedEvents = data.events.filter(event => rowSelection[event.id]);

  function generatePodiumCertificates() {
    const tempPdfData: string[][] = [];

    selectedEvents.map((event: Event) => {
      const results = getEventData(event);

      results.map((result, index: number) => {
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

  useEffect(() => {
    if (size !== undefined && orientation !== undefined && Object.keys(rowSelection).length !== 0) {
      generatePodiumCertificates();
    }
  }, [size, orientation, rowSelection]);

  const podiumDocument = (
    <Document author={organizers.join(', ')} title={`Certificados de podio para el ${data.name}`}>
      {pdfData.map((text, index) => (
        <Page key={index} orientation={orientation} size={size}>
          { background ? <Image src={background} style={styles.background} /> : null }
          <View style={[styles.center, styles.body]}>
            <Text style={{ fontSize: 16, paddingHorizontal: 40, lineHeight: 1.25 }}>
              <Text style={styles.bold}>{joinPersons(delegates)}</Text>, en nombre de la World Cube Association, y <Text style={styles.bold}>{joinPersons(organizers)}</Text>, en nombre del equipo organizador, otorgan el presente
            </Text>
            <View style={[styles.bold, { alignItems: 'center', paddingTop: 20, paddingBottom: 10 }]}>
              <Text style={{ fontSize: 40 }}>CERTIFICADO</Text>
              <Text style={{ fontSize: 25 }}>DE MEDALLA DE {formatMedal(text[1])}</Text>
            </View>
            <Text style={{ fontSize: 16 }}>a</Text>
            <Text style={[styles.bold, { fontSize: 35, paddingTop: 10, paddingBottom: 20 }]}>{text[0]}</Text>
            <Text style={{ fontSize: 16, paddingHorizontal: 40, lineHeight: 1.25 }}>
              por haber obtenido el <Text style={styles.bold}>{formatPlace(text[1])} lugar</Text> en <Text style={styles.bold}>{formatEvents(text[2])}</Text> con {formatResultType(text[2])} de <Text style={styles.bold}>{formatResults(text[3])}</Text> en el <Text style={styles.bold}>{data.name}</Text>, llevado acabo {days === 1 ? 'el día' : 'los días'} <Text style={styles.bold}>{formatDates(date, days.toString())}</Text> en <Text style={styles.bold}>{city}, {state}</Text>.
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );

  return (
    <>
      <DataTable columns={columns} data={data.events} rowSelection={rowSelection} setRowSelection={setRowSelection} />
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
        {Object.keys(rowSelection).length === 0 && <p className='font-semibold'>Debes seleccionar al menos un evento</p>}
        {size === undefined && <p className='font-semibold'>Debes seleccionar el tamaño del documento</p>}
        {orientation === undefined && <p className='font-semibold'>Debes seleccionar la orientación del documento</p>}
        {(size !== undefined && orientation !== undefined && Object.keys(rowSelection).length !== 0) && (
          <>
            {isDesktop ? (
              <PDFViewer className='w-full h-[600px] mt-4'>
                {podiumDocument}
              </PDFViewer>
            ) : (
              <PDFDownloadLink
                className={buttonVariants()}
                document={podiumDocument}
                fileName={`Certificados de podio del ${data.name}`}
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
