import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { auth } from "@/auth";
import { getCurrentUserTeam } from "@/db/queries";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const team = await getCurrentUserTeam({
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    userId: session?.user?.id!,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={session?.user} team={team} />
      {children}
      <Footer />
    </div>
  );
}
