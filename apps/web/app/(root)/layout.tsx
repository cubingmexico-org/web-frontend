import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Suspense } from "react";
import { FooterSkeleton } from "@/components/footer-skeleton";
import { HeaderSkeleton } from "@/components/header-skeleton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      {children}
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}
