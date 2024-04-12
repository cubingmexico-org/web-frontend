'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Image from "next/image"

export default function LoginButton() {
  return (
    <Button onClick={() => signIn('wca')}>
      Inicia sesión con la WCA
      <Image
        className='ml-2'
        src="https://www.worldcubeassociation.org/files/WCAlogo_notext.svg"
        alt="Logo de la WCA"
        width={20}
        height={20}
        priority
      />
    </Button>
  );
}
