import Link from "next/link";
import { CubingMexico, WcaMonochrome } from "@workspace/icons";
import { signInAction } from "@/app/actions";
import { Button } from "@workspace/ui/components/button";
import { UserDropdown } from "./user-dropdown";
import { HeaderNavigationMenu } from "./header-navigation-menu";
import { auth } from "@/auth";
import { getCurrentUserTeam } from "@/db/queries";

export async function Header() {
  const session = await auth();

  const user = session?.user;

  const team = await getCurrentUserTeam({
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
        {user ? (
          <UserDropdown user={user} team={team} />
        ) : (
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
        )}
      </div>
    </header>
  );
}
