import Link from "next/link";
import { CubingMexico } from "@workspace/icons";
import { UserDropdown } from "./user-dropdown";
import { HeaderNavigationMenu } from "./header-navigation-menu";
import { auth } from "@/auth";
import { getCurrentUserTeam } from "@/db/queries";
import { SignInButton } from "./sign-in-button";

export async function Header() {
  const session = await auth();

  const user = session?.user;

  const team = await getCurrentUserTeam({
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    userId: user?.id!,
  });

  return (
    <header className="bg-primary text-primary-foreground body-font top-0 z-50">
      <div className="mx-auto flex flex-col sm:flex-row items-center gap-8 justify-between p-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
          <Link href="/">
            <CubingMexico className="size-16" />
          </Link>
          <HeaderNavigationMenu />
        </div>
        {user ? <UserDropdown user={user} team={team} /> : <SignInButton />}
      </div>
    </header>
  );
}
