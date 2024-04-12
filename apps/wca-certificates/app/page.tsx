import { getServerSession, User } from 'next-auth'
import { authOptions } from "@/lib/auth"
import { redirect } from 'next/navigation'

import Image from "next/image"
import LoginButton from "@/components/login-button";

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/certificates')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="https://storage.googleapis.com/cubingmexico_dev_bucket/img/cubingmexico_logo.svg"
        alt="Logo de Cubing México"
        width={300}
        height={300}
        priority
        className="mb-8"
      />
      <h1 className="text-2xl mb-4">Certificados de la WCA</h1>
      <p className='mb-4'>Primero inicia sesión</p>
      <LoginButton />
    </main>
  );
}