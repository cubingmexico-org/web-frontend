import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@workspace/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { User } from "next-auth";
import { SignOut } from "./auth-components";
import { ThemeSwitcher } from "./theme-switcher";
import { CubingMexico } from "@workspace/icons";

export function Header({ user }: { user: User }) {
  return (
    <header className="bg-primary text-primary-foreground body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <CubingMexico className="size-16" />
        <Link
          className="flex title-font font-medium items-center text-primary-foreground mb-4 md:mb-0"
          href="/"
        >
          <span className="ml-3 text-2xl">Certificados</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full">
              <Avatar>
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10}>
              <ThemeSwitcher />
              <SignOut />
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
