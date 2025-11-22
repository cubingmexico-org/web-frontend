import { buttonVariants } from "@workspace/ui/components/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Teams | Cubing México",
  description:
    "Encuentra tu Team de speedcubing en México y conéctate con otros cuberos.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grow container mx-auto px-4 py-8">
      {children}

      <div className="mt-12 bg-muted/50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Comienza tu propio Team</h2>
        <p className="mb-4">
          ¿No encuentras tu Team en la lista? ¡Registra uno nuevo y comienza a
          conectar con otros speedcubers en tu estado!
        </p>
        <div className="flex gap-4">
          <Link
            href="https://www.facebook.com/cubingmexico"
            target="_blank"
            className={buttonVariants({ variant: "default" })}
          >
            Contáctate
          </Link>
        </div>
      </div>
    </main>
  );
}
