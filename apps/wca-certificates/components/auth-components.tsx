/* eslint-disable @typescript-eslint/no-misused-promises -- . */

import { Button } from "@repo/ui/button";
import { Icons } from "@repo/ui/icons";
import type { getDictionary } from "@/get-dictionary";
import { signIn, signOut } from "auth";

export function SignIn({
  provider,
  dictionary,
  ...props
}: {
  provider?: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>["auth_components"];
} & React.ComponentPropsWithRef<typeof Button>): JSX.Element {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
      className="flex justify-center"
    >
      <Button className="flex gap-2" {...props}>
        <Icons.WcaMonochrome className="size-5" />
        {dictionary.signIn}
      </Button>
    </form>
  );
}

export function SignOut({
  dictionary,
  ...props
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["auth_components"];
} & React.ComponentPropsWithRef<typeof Button>): JSX.Element {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <Button className="w-full p-0" variant="ghost" {...props}>
        {dictionary.signOut}
      </Button>
    </form>
  );
}
