import React from "react";
import Image from 'next/image';
import Link from 'next/link';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex">
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden 2xl:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden xl:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden lg:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden md:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          height={300}
          src="/border.svg"
          width={300}
        />
      </div>
      <div className="text-center">
        <div className="mx-auto inline-block">
          <Link href='/'>
            <Image
              alt="Logo de la Copa Inter-Patrocinadores"
              className="mx-auto"
              height={300}
              src="/logo.svg"
              width={300}
            />
          </Link>
        </div>
        <h1 className="text-2xl font-semibold">Copa Inter-Patrocinadores</h1>
        <h2 className="text-lg">Primera temporada (Abril - Julio)</h2>
        <p className="p-4">Competencia dirigida a la comunidad nacional, con el propósito de dar mayor protagonismo a los speedcubers y a las tiendas que los apoyan, motivarlos a seguir compitiendo y mejorando sus tiempos, y hacer crecer el speedcubing en todo el país.</p>
      </div>
      <div className="p-4">
        {children}
      </div>
      <div className="text-center p-4">
        <p className="font-bold text-lg">Aviso</p>
        <p>
          El contador aún se encuentra en fase de pruebas, por lo que podría haber ocasiones en las que los PRs no se contabilicen correctamente. Si observas alguna inconsistencia, te agradeceríamos que la reportaras. Agradecemos tu comprensión y colaboración en este asunto.
        </p>
        <p className="mt-2">Esta página se actualiza sábados y domingos entre 19:00 UTC-6 (7:00 PM hora de la Ciudad de México).</p>
        <p className="mt-2">
          Puedes contactarnos a través de:
          <ul className="list-disc list-inside mt-2">
            <li><Link className="text-red-700 hover:underline" href="https://www.facebook.com/cubingmexico">Cubing México</Link></li>
            {/* eslint-disable-next-line react/no-unescaped-entities -- . */}
            <li className="mt-2"><Link className="text-red-700 hover:underline" href="https://www.facebook.com/profile.php?id=100063651453072">SanLuis Rubik's Team</Link></li>
          </ul>
        </p>
        <div className="flex justify-center items-center pt-4">
          <Image
            alt="Logo de Cubing México"
            height={100}
            src="/cubingmexico_logo.svg"
            width={100}
          />
          <Image
            alt="Logo de SanLuis Rubik's Team"
            height={100}
            src="/slp_logo.svg"
            width={100}
          />
        </div>
      </div>
      <div className="flex">
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden 2xl:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden xl:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden lg:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          className="hidden md:block"
          height={300}
          src="/border.svg"
          width={300}
        />
        <Image
          alt="Logo de la Copa Inter-patrocinadores"
          height={300}
          src="/border.svg"
          width={300}
        />
      </div>
    </main>
  )
}