import Image from "next/image";
import Link from "next/link";
import { Copa, CubingMexico, SponsorsCupBorder } from "@workspace/icons";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex">
        <SponsorsCupBorder className="hidden 2xl:block h-8 w-80 text-primary/75" />
        <SponsorsCupBorder className="hidden xl:block h-8 w-80 text-primary/75" />
        <SponsorsCupBorder className="hidden lg:block h-8 w-80 text-primary/75" />
        <SponsorsCupBorder className="hidden md:block h-8 w-80 text-primary/75" />
        <SponsorsCupBorder className="h-8 w-80 text-primary/75" />
      </div>
      <div className="text-center">
        <div className="mx-auto inline-block">
          <Link href="/">
            <Copa className="size-80" />
          </Link>
        </div>
        <h1 className="text-2xl font-semibold">
          Copa Inter-Patrocinadores 2025
        </h1>
        <h2 className="text-lg">Tercera temporada (Mayo - Agosto)</h2>
        <p className="p-4">
          Competencia dirigida a la comunidad nacional, con el propósito de dar
          mayor protagonismo a los speedcubers y a las tiendas que los apoyan,
          motivarlos a seguir compitiendo y mejorando sus tiempos, y hacer
          crecer el speedcubing en todo el país.
        </p>
      </div>
      {children}
      <div className="text-center p-4">
        <p className="font-bold text-lg">Aviso</p>
        <p>
          Si observas alguna inconsistencia, te agradeceríamos que la
          reportaras. Agradecemos tu comprensión y colaboración en este asunto.
        </p>
        <p className="mt-2">
          Esta página se actualiza los domingos a las 19:00 UTC-6 (7:00 PM hora
          de la Ciudad de México).
        </p>
        <div className="mt-2">
          Puedes contactarnos a través de:
          <ul className="list-disc list-inside mt-2">
            <li>
              <Link
                className="text-red-700 hover:underline"
                href="https://www.facebook.com/cubingmexico"
              >
                Cubing México
              </Link>
            </li>
            <li className="mt-2">
              <Link
                className="text-red-700 hover:underline"
                href="https://www.facebook.com/profile.php?id=100063651453072"
              >
                {`SanLuis Rubik's Team`}
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex justify-center items-center pt-4">
          <CubingMexico className="size-[100px]" />
          <Image
            alt="Logo de SanLuis Rubik's Team"
            height={100}
            src="/slp_logo.svg"
            width={100}
          />
        </div>
        <div className="flex justify-center pt-4">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex">
        <SponsorsCupBorder className="hidden 2xl:block h-8 w-80 text-primary/75" />
        <SponsorsCupBorder className="hidden xl:block h-8 w-80 text-primary/75" />
        <SponsorsCupBorder className="hidden lg:block h-8 w-80 text-primary/75" />
        <SponsorsCupBorder className="hidden md:block h-8 w-80 text-primary/75" />
        <SponsorsCupBorder className="h-8 w-80 text-primary/75" />
      </div>
    </main>
  );
}
