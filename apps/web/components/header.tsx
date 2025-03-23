import Link from "next/link";
import { Icons } from "@workspace/ui/components/icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { SignIn, SignOut } from "./auth-components";
import { User } from "next-auth";

export function Header({ user }: { user?: User }) {
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
              <Button className="mr-2 hover:bg-primary hover:text-muted-foreground text-base">
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
              <Button className="mr-2 hover:bg-primary hover:text-muted-foreground text-base">
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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Sum of Ranks</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <Link href="/sor/single" className="w-full">
                        Sum of Ranks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/sor/single/teams" className="w-full">
                        Sum of Ranks (Teams)
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Kinch Ranks</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <Link href="/kinch" className="w-full">
                        Kinch Ranks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Link href="/kinch/teams" className="w-full">
                        Kinch Ranks (Teams)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Link href="/kinch/NAY" className="w-full">
                        Kinch Ranks estatales
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-2 hover:bg-primary hover:text-muted-foreground text-base">
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
              <DropdownMenuItem>
                <Link href="/bronze-members" className="w-full">
                  Miembros Bronce
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link className="mr-2 hover:text-muted-foreground" href="/teams">
            Teams estatales
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-2 hover:bg-primary hover:text-muted-foreground text-base">
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full">
                <Avatar>
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/profile" className="w-full">
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/persons/${user.id}`} className="w-full">
                    Mis resultados
                  </Link>
                </DropdownMenuItem>
                <SignOut />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignIn
              className="mr-2 hover:bg-primary hover:text-muted-foreground text-base"
              provider="wca"
            />
          )}
        </nav>
      </div>
    </header>
  );
}
