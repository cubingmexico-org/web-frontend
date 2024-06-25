import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { auth } from "@/auth"
import { SignOut } from "./auth-components"

export default async function UserButton(): Promise<JSX.Element> {
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
        <DropdownMenuItem>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}