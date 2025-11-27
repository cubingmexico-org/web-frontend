import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "@cubing/icons";
import { auth } from "@/auth";
import type { User } from "next-auth";
import { headers } from "next/headers";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { FooterSkeleton } from "@/components/footer-skeleton";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const session = await auth();
  const headersList = await headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  return (
    <SessionProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header user={session?.user as User} />
        <div className="flex-1">
          {origin !== process.env.NEXT_PUBLIC_APP_URL ? (
            <AlertDialog open>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Dominio incorrecto</AlertDialogTitle>
                  <AlertDialogDescription>
                    El dominio de la solicitud no coincide con el dominio
                    esperado. El dominio actual es {origin} y el dominio
                    esperado es{" "}
                    <Link
                      className="hover:underline"
                      href={process.env.NEXT_PUBLIC_APP_URL || "/"}
                    >
                      {process.env.NEXT_PUBLIC_APP_URL}
                    </Link>
                    .
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            children
          )}
        </div>
        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>
      </div>
    </SessionProvider>
  );
}
