import { getServerSession, User } from 'next-auth'
import { authOptions } from "@/lib/auth"

import Header from '@/components/header'
import "@cubing/icons"


export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await getServerSession(authOptions)
  
  const user = session?.user as User

  return (
    <main className="flex flex-col h-screen">
      <Header user={user} />
      {children}
    </main>
  );
}
