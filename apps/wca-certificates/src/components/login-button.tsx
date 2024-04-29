/* eslint-disable @typescript-eslint/no-misused-promises -- . */
'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@repo/ui/button'
import Image from "next/image"

export default function LoginButton(): JSX.Element {
  return (
    <Button onClick={() => signIn('wca')}>
      Inicia sesión con la WCA
      <Image
        alt="Logo de la WCA"
        className='ml-2'
        height={20}
        priority
        src="https://www.worldcubeassociation.org/files/WCAlogo_notext.svg"
        width={20}
      />
    </Button>
  );
}
