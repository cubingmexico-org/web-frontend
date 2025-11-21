"use client";

import Link from "next/link";
import { Users, UserCheck, UserIcon, LogOut } from "lucide-react";
import type { User } from "next-auth";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { signOutAction } from "@/app/actions";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";

export function UserDropdown({
  user,
  team,
}: {
  user: User;
  team: {
    id: string;
    name: string;
  } | null;
}) {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar className="size-12">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "center" : "end"}>
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
        {team && (
          <DropdownMenuItem>
            <Users />
            <Link href={`/teams/${team.id}`} className="w-full">
              Mi Team
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={async () => {
            await signOutAction();
          }}
        >
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
