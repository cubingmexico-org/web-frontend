import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tablero de la Copa Inter-Patrocinadores | Cubing México",
  description: "Tablero de posiciones de la Copa Inter-Patrocinadores",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
        </body>
    </html>
  );
}
