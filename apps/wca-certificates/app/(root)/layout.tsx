import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "@cubing/icons";
import { auth } from "@/auth";
import { User } from "next-auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await auth();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header user={session?.user as User} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
