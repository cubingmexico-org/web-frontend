/* eslint-disable @typescript-eslint/no-shadow -- .*/
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
'use client'

import React, { useState } from 'react'
import { Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer';
import type { JSONContent } from '@tiptap/react'
import { Button } from "@repo/ui/button"
import { podium } from '@/lib/placeholders';
import Tiptap from './tiptap'

export default function DocumentForm(): JSX.Element {

  const [content, setContent] = useState<JSONContent>(podium)

  const [showPDF, setShowPDF] = useState(false)

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setShowPDF(true)
  }

  const handleContentChange = (content: JSONContent) => {
    setContent(content)
    setShowPDF(false)
  }

  const renderContent = (content: JSONContent) => {
    return content.content?.map((item, index) => {
      const key = `text_${index}`;

      if (item.type === 'paragraph') {
        return <Text key={key}>{item.content?.[0].text}</Text>
      } else if (item.type === 'heading') {
        return <Text key={key}>{item.content?.[0].text}</Text>
      }
      return null
    })
  }

  return (
    <div>
      <form
        className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10"
        onSubmit={handleSubmit}
      >
        <Tiptap onChange={(newContent: JSONContent) => { handleContentChange(newContent); }} />

        <Button disabled={!content.content?.[0].content?.[0].text} type="submit">Generar PDF</Button>
      </form>
      {showPDF ? (
        <PDFViewer className='w-full h-[600px] mt-4'>
          <Document>
            <Page size="LETTER">
              <View debug>
                {renderContent(content)}
              </View>
            </Page>
          </Document>
        </PDFViewer>
      ) : null}
    </div>
  )
}