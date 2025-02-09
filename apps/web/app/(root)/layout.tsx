import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={session?.user} />
      {children}
      <Footer />
    </div>
  );
}
