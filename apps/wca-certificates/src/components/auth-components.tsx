/* eslint-disable @typescript-eslint/no-misused-promises -- . */
/* eslint-disable react/jsx-pascal-case -- . */

import { Button } from "@repo/ui/button"
import { Icons } from "@repo/ui/icons"
import { signIn, signOut } from "auth"

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>): JSX.Element {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(provider)
      }}
      className="flex justify-center"
    >
      <Button className="flex gap-2" {...props}>
        <Icons.wca className="size-5" />Iniciar sesión
      </Button>
    </form>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>): JSX.Element {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
      className="w-full"
    >
      <Button className="w-full p-0" variant="ghost" {...props}>
        Cerrar sesión
      </Button>
    </form>
  )
}