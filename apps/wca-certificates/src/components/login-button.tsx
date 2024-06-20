/* eslint-disable @typescript-eslint/no-misused-promises -- . */
'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@repo/ui/button'
import Image from "next/image"

export default function LoginButton(): JSX.Element {
  return (
    <Button onClick={() => signIn('wca')}>
      <Image
        alt="Logo de la WCA"
        className='mr-2'
        height={20}
        priority
        src='https://www.worldcubeassociation.org/files/WCAlogo.svg'
        width={20}
      />
      Inicia sesión con la WCA
    </Button>
  );
}
