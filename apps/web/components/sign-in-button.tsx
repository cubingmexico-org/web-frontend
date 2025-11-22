"use client";

import { WcaMonochrome } from "@workspace/icons";
import { signInAction } from "@/app/actions";
import { Button } from "@workspace/ui/components/button";

export function SignInButton() {
  return (
    <Button
      onClick={async () => {
        signInAction("wca");
      }}
      variant="ghost"
      className="hover:bg-muted/10 hover:text-primary-foreground focus:bg-muted/10 dark:hover:bg-muted/10 dark:focus:bg-muted/10"
    >
      <WcaMonochrome />
      Iniciar sesión
    </Button>
  );
}
