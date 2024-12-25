import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@workspace/ui/components/toaster";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
  params: { lang: Locale };
}

export async function generateMetadata({
  params,
}: RootLayoutProps): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default function RootLayout({
  children,
  params,
}: RootLayoutProps): JSX.Element {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
