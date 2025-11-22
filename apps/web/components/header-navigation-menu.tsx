"use client";

import Link from "next/link";
import {
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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import { CubingMexico } from "@workspace/icons";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export function HeaderNavigationMenu() {
  const isMobile = useIsMobile();

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${navigationMenuTriggerStyle()} bg-primary hover:bg-muted/10 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground`}
          >
            <Link href="/competitions">Competencias</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${navigationMenuTriggerStyle()} bg-primary hover:bg-muted/10 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground`}
          >
            <Link href="/teams">Teams estatales</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-primary hover:bg-muted/10 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground data-[active=true]:bg-muted/10 data-[state=open]:hover:bg-muted/10 data-[state=open]:text-primary-foreground data-[state=open]:bg-muted/5 data-[state=open]:focus:bg-muted/10">
            Resultados
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/rankings/333/single"
                    className="flex-row items-center gap-2"
                  >
                    <ChartNoAxesColumnIncreasing className="size-4" />
                    Rankings
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/records" className="flex-row items-center gap-2">
                    <Medal className="size-4" />
                    Récords
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/sor/single"
                    className="flex-row items-center gap-2"
                  >
                    <PlusCircle className="size-4" />
                    Sum of Ranks
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/sor/single/teams"
                    className="flex-row items-center gap-2"
                  >
                    <PlusCircle className="size-4" />
                    Sum of Ranks (Teams)
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/kinch" className="flex-row items-center gap-2">
                    <ChartBarBig className="size-4" />
                    Kinch Ranks
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/kinch/MEX"
                    className="flex-row items-center gap-2"
                  >
                    <ChartBarBig className="size-4" />
                    Kinch Ranks estatales
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/kinch/teams"
                    className="flex-row items-center gap-2"
                  >
                    <ChartBarBig className="size-4" />
                    Kinch Ranks (Teams)
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-primary hover:bg-muted/10 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground data-[active=true]:bg-muted/10 data-[state=open]:hover:bg-muted/10 data-[state=open]:text-primary-foreground data-[state=open]:bg-muted/5 data-[state=open]:focus:bg-muted/10">
            Personas
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/persons" className="flex-row items-center gap-2">
                    <Users className="size-4" />
                    Competidores
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/organisers"
                    className="flex-row items-center gap-2"
                  >
                    <Users className="size-4" />
                    Organizadores
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="/delegates"
                    className="flex-row items-center gap-2"
                  >
                    <Users className="size-4" />
                    Delegados
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/members" className="flex-row items-center gap-2">
                    <Users className="size-4" />
                    Miembros (Sistema Mollerz)
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-primary hover:bg-muted/10 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground data-[active=true]:bg-muted/10 data-[state=open]:hover:bg-muted/10 data-[state=open]:text-primary-foreground data-[state=open]:bg-muted/5 data-[state=open]:focus:bg-muted/10">
            Acerca de
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[250px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/about" className="flex-row items-center gap-2">
                    <Info className="size-4" />
                    Acerca de
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/faq" className="flex-row items-center gap-2">
                    <CircleHelp className="size-4" />
                    Preguntas frecuentes
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/logo" className="flex-row items-center gap-2">
                    <CubingMexico className="size-4" />
                    Logotipo
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link href="/tools" className="flex-row items-center gap-2">
                    <Hammer className="size-4" />
                    Herramientas
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
