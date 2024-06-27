/* eslint-disable @typescript-eslint/no-unsafe-assignment -- . */

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { auth } from "@/auth"
import type { getDictionary } from "@/get-dictionary"
import { SignOut } from "./auth-components"
import LocaleSwitcher from "./locale-switcher"

interface UserButtonProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

export default async function UserButton({ dictionary }: UserButtonProps): Promise<JSX.Element> {
  const session = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="!relative !w-8 !h-8 !rounded-full" variant="ghost">
          <Avatar>
            <AvatarImage
              alt={session?.user?.name ?? ""}
              src={session?.user?.image ?? ""}
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.id}
            </p>
          </div>
        </DropdownMenuLabel>
        <LocaleSwitcher dictionary={dictionary.locale_switcher} />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOut dictionary={dictionary.auth_components} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}