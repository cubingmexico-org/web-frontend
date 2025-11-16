import { WcaMonochrome } from "@workspace/icons";
import { Button } from "@workspace/ui/components/button";
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import { signIn, signOut } from "auth";
import { LogOut } from "lucide-react";

export function SignIn({
  provider,
  ...props
}: {
  provider?: string;
} & React.ComponentPropsWithRef<typeof Button>): React.JSX.Element {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
      className="flex justify-center"
    >
      <Button {...props}>
        <WcaMonochrome />
        Iniciar sesión
      </Button>
    </form>
  );
}

export function SignOut({
  ...props
}: React.ComponentPropsWithRef<typeof DropdownMenuItem>): React.JSX.Element {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <DropdownMenuItem {...props}>
        <LogOut />
        <button>Cerrar sesión</button>
      </DropdownMenuItem>
    </form>
  );
}
