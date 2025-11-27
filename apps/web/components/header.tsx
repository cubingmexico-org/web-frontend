import Link from "next/link";
import { CubingMexico } from "@workspace/icons";
import { UserDropdown } from "./user-dropdown";
import { HeaderNavigationMenu } from "./header-navigation-menu";
import { auth } from "@/auth";
import { getCurrentUserTeam } from "@/db/queries";
import { UserAuthForm } from "./user-auth-form";

export async function Header() {
  const session = await auth();

  if (!session) {
    return (
      <header className="bg-primary text-primary-foreground body-font top-0 z-50">
        <div className="mx-auto flex flex-col sm:flex-row items-center gap-8 justify-between p-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
            <Link href="/">
              <CubingMexico className="size-16" />
            </Link>
            <HeaderNavigationMenu />
          </div>
          <UserAuthForm />
        </div>
      </header>
    );
  }

  const user = session.user!;

  const team = await getCurrentUserTeam({
    userId: user.id!,
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
        <UserDropdown user={user} team={team} />
      </div>
    </header>
  );
}
