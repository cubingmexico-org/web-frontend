import type { User } from 'next-auth';
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"
import Header from '@/components/header'
import "@cubing/icons"

export default async function Layout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {

  const session = await getServerSession(authOptions)
  
  const user = session?.user as User

  return (
    <main className="flex flex-col sm:gap-4 sm:py-4">
      <Header user={user} />
      {children}
    </main>
  );
}
