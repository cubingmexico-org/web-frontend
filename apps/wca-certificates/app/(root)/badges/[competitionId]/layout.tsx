import type { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Gafetes - Cubing México",
    description: "Gafetes - Cubing México",
  };
}

export default function Layout({ children }: LayoutProps) {
  return <main className="container mx-auto px-4 py-8">{children}</main>;
}
