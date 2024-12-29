import Link from "next/link";
import { Icons } from "@workspace/ui/components/icons";

export function Header() {
  return (
    <header className="bg-green-900 text-white body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Icons.CubingMexico className="size-16" />
        <Link
          className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
          href="/"
        >
          <span className="ml-3 text-2xl">Cubing México</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link
            className="mr-5 hover:text-green-900"
            href="/competitions"
          >
            Competencias
          </Link>
          <Link
            className="mr-5 hover:text-green-900"
            href="/rankings/333/single"
          >
            Rankings
          </Link>
          <Link className="mr-5 hover:text-green-900" href="/records">
            Récords
          </Link>
          <Link className="mr-5 hover:text-green-900" href="/events">
            Eventos
          </Link>
          <Link className="mr-5 hover:text-green-900" href="/about">
            Acerca de
          </Link>
        </nav>
      </div>
    </header>
  );
}
