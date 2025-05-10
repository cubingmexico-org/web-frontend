import Link from "next/link";
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
import {
  ChevronDown,
  UserIcon,
  UserCheck,
  Trophy,
  ChartNoAxesColumnIncreasing,
  Medal,
  ChartBarBig,
  PlusCircle,
  Users,
  CircleHelp,
  Info,
  Hammer,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { SignIn, SignOut } from "./auth-components";
import type { User } from "next-auth";
import { CubingMexico } from "@workspace/icons";
import Image from "next/image";

export function Header({ user }: { user?: User }) {
  return (
    <header className="bg-primary text-primary-foreground body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <CubingMexico className="size-16" />
        <Link
          className="flex title-font font-medium items-center text-primary-foreground mb-4 md:mb-0"
          href="/"
        >
          <span className="ml-3 text-2xl">Cubing México</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-2 hover:bg-primary hover:text-muted-foreground text-base dark:shadow-none">
                Competencias <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Trophy />
                <Link href="/competitions" className="w-full">
                  Oficiales
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Image
                  src="/copa.svg"
                  alt="Copa Inter-Patrocinadores"
                  width={16}
                  height={16}
                />
                <Link href="https://copa.cubingmexico.net" className="w-full">
                  Copa Inter-Patrocinadores
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-2 hover:bg-primary hover:text-muted-foreground text-base dark:shadow-none">
                Resultados <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <ChartNoAxesColumnIncreasing />
                <Link href="/rankings/333/single" className="w-full">
                  Rankings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Medal />
                <Link href="/records" className="w-full">
                  Récords
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <PlusCircle />
                  Sum of Ranks
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <PlusCircle />
                      <Link href="/sor/single" className="w-full">
                        Sum of Ranks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PlusCircle />
                      <Link href="/sor/single/teams" className="w-full">
                        Sum of Ranks (Teams)
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ChartBarBig />
                  Kinch Ranks
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <ChartBarBig />
                      <Link href="/kinch" className="w-full">
                        Kinch Ranks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ChartBarBig />
                      <Link href="/kinch/MEX" className="w-full">
                        Kinch Ranks estatales
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ChartBarBig />
                      <Link href="/kinch/teams" className="w-full">
                        Kinch Ranks (Teams)
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-2 hover:bg-primary hover:text-muted-foreground text-base dark:shadow-none">
                Personas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Users />
                <Link href="/persons" className="w-full">
                  Competidores
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users />
                <Link href="/organisers" className="w-full">
                  Organizadores
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users />
                <Link href="/delegates" className="w-full">
                  Delegados
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users />
                <Link href="/members" className="w-full">
                  Miembros (Sistema Mollerz)
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            className="mr-2 hover:text-muted-foreground font-medium"
            href="/teams"
          >
            Teams estatales
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mr-2 hover:bg-primary hover:text-muted-foreground text-base dark:shadow-none">
                Acerca de <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Info />
                <Link href="/about" className="w-full">
                  Acerca de
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <CircleHelp />
                <Link href="/faq" className="w-full">
                  Preguntas frecuentes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CubingMexico />
                <Link href="/logo" className="w-full">
                  Logotipo
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Hammer />
                <Link href="/tools" className="w-full">
                  Herramientas
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
              <DropdownMenuContent
                sideOffset={10}
                align="end"
                alignOffset={-20}
              >
                <DropdownMenuItem>
                  <UserIcon />
                  <Link href="/profile" className="w-full">
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserCheck />
                  <Link href={`/persons/${user.id}`} className="w-full">
                    Mis resultados
                  </Link>
                </DropdownMenuItem>
                <SignOut />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignIn
              className="mr-2 hover:bg-primary hover:text-muted-foreground text-base dark:shadow-none"
              provider="wca"
            />
          )}
        </nav>
      </div>
    </header>
  );
}
