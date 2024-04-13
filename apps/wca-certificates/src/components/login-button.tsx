'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@repo/ui/button'
import Image from "next/image"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- We don't need to specify the return type
export default function LoginButton() {
  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- We want to call signIn when the button is clicked
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
