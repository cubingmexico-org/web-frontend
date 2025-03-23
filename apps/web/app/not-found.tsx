import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@workspace/ui/components/button";
import { Home, RotateCcw } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center">
        <div className="container max-w-3xl px-4 py-16 text-center">
          <div className="mb-8 relative">
            <div className="flex justify-center">
              <div className="relative w-40 h-40 md:w-56 md:h-56">
                {/* Stylized 404 with cube elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-2 rotate-12 scale-110">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 md:w-12 md:h-12 rounded-md ${
                          [0, 2, 6, 8].includes(i)
                            ? "bg-yellow-500"
                            : [1, 3, 5, 7].includes(i)
                              ? "bg-green-500"
                              : "bg-white border-2 border-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mt-4">404</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ¡Página no encontrada!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Parece que este cubo está sin resolver. La página que estás buscando
            no existe o ha sido movida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-green-500 hover:bg-green-600"
            >
              <Link href="/">
                <Home />
                Volver al inicio
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="javascript:history.back()">
                <RotateCcw />
                Regresar
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
