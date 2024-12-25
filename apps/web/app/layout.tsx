import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import Link from "next/link";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="bg-green-500 text-white body-font">
              <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Icons.CubingMexico className="size-16" />
                <Link
                  className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
                  href="/"
                >
                  <span className="ml-3 text-2xl">Cubing México</span>
                </Link>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                  <Link
                    className="mr-5 hover:text-green-900"
                    href="/competitions"
                  >
                    Competencias
                  </Link>
                  <Link
                    className="mr-5 hover:text-green-900"
                    href="/rankings/333/single"
                  >
                    Rankings
                  </Link>
                  <Link className="mr-5 hover:text-green-900" href="/records">
                    Récords
                  </Link>
                  <Link className="mr-5 hover:text-green-900" href="/events">
                    Eventos
                  </Link>
                  <Link className="mr-5 hover:text-green-900" href="/about">
                    Acerca de
                  </Link>
                </nav>
              </div>
            </header>
            {children}
            <footer className="text-gray-600 body-font">
              <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
                <Link
                  className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
                  href="/"
                >
                  <span className="ml-3 text-xl">Cubing México</span>
                </Link>
                <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                  © {new Date().getFullYear()} Cubing México —
                  <a
                    className="text-gray-600 ml-1"
                    href="https://twitter.com/cubingmexico"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    @cubingmexico
                  </a>
                </p>
                <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                  <Link className="text-gray-500 mr-5" href="/privacy">
                    Política de Privacidad
                  </Link>
                  <Link className="text-gray-500" href="/terms">
                    Términos de Servicio
                  </Link>
                </span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
