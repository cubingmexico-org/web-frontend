"use client";

import { Button } from "@workspace/ui/components/button";
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import { signOut } from "next-auth/react";
import { LoaderCircle, LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { WcaMonochrome } from "@workspace/icons";

export function SignIn(): JSX.Element {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? <LoaderCircle className="animate-spin" /> : <WcaMonochrome />}
      <span>Iniciar sesión</span>
    </Button>
  );
}

export function SignOut(): JSX.Element {
  return (
    <DropdownMenuItem
      onClick={() => {
        signOut({
          redirectTo: "/",
        });
      }}
    >
      <LogOut />
      <span>Cerrar sesión</span>
    </DropdownMenuItem>
  );
}
