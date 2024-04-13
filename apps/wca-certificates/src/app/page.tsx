import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Image from "next/image"
import { authOptions } from "../lib/auth"
import LoginButton from "../components/login-button";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Return type is inferred
export default async function Page() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/certificates')
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Image
        alt="Logo de Cubing México"
        className="mb-8"
        height={300}
        priority
        src="https://storage.googleapis.com/cubingmexico_dev_bucket/img/cubingmexico_logo.svg"
        width={300}
      />
      <h1 className="text-2xl mb-4">Certificados de la WCA</h1>
      <p className='mb-4'>Primero inicia sesión</p>
      <LoginButton />
    </main>
  );
}