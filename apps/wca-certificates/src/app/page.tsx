import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Image from "next/image"
import Link from "next/link"
import { authOptions } from "../lib/auth"
import LoginButton from "../components/login-button";

export default async function Page(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/certificates')
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className='flex items-center justify-center'>
              <Image
                alt="Logo de Cubing México"
                className="mb-8"
                height={300}
                priority
                src="https://storage.googleapis.com/cubingmexico_dev_bucket/img/cubingmexico_logo.svg"
                width={300}
              />
            </div>
            <h1 className="text-3xl font-bold">Inicia sesión</h1>
            <p className="text-balance text-muted-foreground">
              Serás redirigido a la página de la World Cube Association
            </p>
          </div>
          <div className="grid gap-4">
            <LoginButton />
          </div>
          <div className="mt-4 text-center text-sm">
            ¿No tienes cuenta de la World Cube Association?{" "}
            <Link className="underline" href="https://www.worldcubeassociation.org/users/sign_up">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          alt="Image"
          className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
          height="1080"
          src="https://storage.googleapis.com/cubingmexico_dev_bucket/img/competidores.jpg"
          width="1920"
        />
      </div>
    </div>
  );
}