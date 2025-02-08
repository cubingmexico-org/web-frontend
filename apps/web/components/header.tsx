import Link from "next/link";
import { Icons } from "@workspace/ui/components/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Icons.CubingMexico className="size-16" />
        <Link
          className="flex title-font font-medium items-center text-primary-foreground mb-4 md:mb-0"
          href="/"
        >
          <span className="ml-3 text-2xl">Cubing México</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-5 hover:bg-primary hover:text-muted-foreground text-base">
                Competencias <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/competitions" className="w-full">
                  Oficiales
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="https://copa.cubingmexico.net" className="w-full">
                  Copa Inter-Patrocinadores
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-5 hover:bg-primary hover:text-muted-foreground text-base">
                Resultados <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/rankings/333/single" className="w-full">
                  Rankings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/records" className="w-full">
                  Récords
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/sor/single" className="w-full">
                  Sum of Ranks
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/kinch" className="w-full">
                  Kinch Ranks
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-5 hover:bg-primary hover:text-muted-foreground text-base">
                Personas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/persons" className="w-full">
                  Competidores
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/organisers" className="w-full">
                  Organizadores
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/delegates" className="w-full">
                  Delegados
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link className="mr-5 hover:text-muted-foreground" href="/teams">
            Teams estatales
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-5 hover:bg-primary hover:text-muted-foreground text-base">
                Acerca de <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/about" className="w-full">
                  Acerca de
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/donations" className="w-full">
                  Donaciones
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/faq" className="w-full">
                  Preguntas frecuentes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/logo" className="w-full">
                  Logotipo
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
