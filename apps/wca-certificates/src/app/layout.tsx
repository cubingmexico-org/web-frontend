import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import "@repo/ui/styles.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Certificados WCA - Cubing México",
  description: "Certificados WCA - Cubing México",
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Return type is inferred
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
