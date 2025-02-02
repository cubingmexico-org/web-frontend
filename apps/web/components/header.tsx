import Link from "next/link";
import { Icons } from "@workspace/ui/components/icons";

export function Header() {
  return (
    <header className="bg-primary text-white body-font">
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
            className="mr-5 hover:text-muted-foreground"
            href="/competitions"
          >
            Competencias
          </Link>
          <Link
            className="mr-5 hover:text-muted-foreground"
            href="/rankings/333/single"
          >
            Rankings
          </Link>
          <Link className="mr-5 hover:text-muted-foreground" href="/records">
            Récords
          </Link>
          <Link className="mr-5 hover:text-muted-foreground" href="/sor/single">
            SOR
          </Link>
          <Link className="mr-5 hover:text-muted-foreground" href="/kinch">
            Kinch
          </Link>
          <Link className="mr-5 hover:text-muted-foreground" href="/about">
            Acerca de
          </Link>
        </nav>
      </div>
    </header>
  );
}
