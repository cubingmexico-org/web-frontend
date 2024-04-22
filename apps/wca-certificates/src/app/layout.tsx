import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import "@repo/ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Certificados WCA - Cubing México",
  description: "Certificados WCA - Cubing México",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}