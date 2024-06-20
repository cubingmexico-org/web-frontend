import type { User } from 'next-auth';
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"
import Header from '@/components/header'
import Footer from '@/components/footer';
import "@cubing/icons"

export default async function Layout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {

  const session = await getServerSession(authOptions)

  const user = session?.user as User

  return (
    <main className="flex flex-col min-h-screen justify-between sm:gap-4 sm:py-4">
      <div>
        <Header user={user} />
        {children}
      </div>
      <Footer />
    </main>
  );
}
