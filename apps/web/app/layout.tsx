import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import "@cubing/icons";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://cubingmexico.net"),
  title: "Cubing México",
  description:
    "Cubing México es un stio web que recopila rankings y récords estatales mexicanos basado en los resultados de la WCA.",
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
