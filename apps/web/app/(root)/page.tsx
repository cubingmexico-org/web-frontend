import Image from "next/image";
import { ArrowRight, Trophy, Users, Clock } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Link from "next/link";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/alert";

export default function Page() {
  return (
    <main className="flex-grow">
      {/* <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <span className="font-semibold">¡Atención!</span> Las inscripciones para el Campeonato Nacional 2024
                cierran en 3 días.{" "}
                <a href="/competitions?id=national-2024" className="underline font-medium hover:text-yellow-900">
                  Regístrate ahora →
                </a>
              </div>
            </div>
            <button
              className="ml-4 text-yellow-600 hover:text-yellow-800 focus:outline-none"
              aria-label="Cerrar notificación"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div> */}

      <section className="text-muted-foreground body-font">
        <div className="container mx-auto pt-8 pb-8">
          <Alert>
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
            >
              <title>Discord</title>
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
            <AlertTitle>¡Ahora tenemos servidor de Discord!</AlertTitle>
            <AlertDescription>
              Únete a nuestra comunidad en{" "}
              <Link
                className="hover:underline text-accent-foreground"
                href="https://discord.gg/N9KcpWngz7"
              >
                Discord
              </Link>{" "}
              para discutir sobre speedcubing, compartir tus tiempos y conocer a
              otros cuberos mexicanos.
            </AlertDescription>
          </Alert>
        </div>
        <div className="container mx-auto flex px-5 pb-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-primary">
              Cubing México
              <br className="hidden lg:inline-block" />
              Rankings y Récords Estatales Mexicanos
            </h1>
            <p className="mb-8 leading-relaxed">
              Descubre a los mejores speedcubers en México, sigue los récords
              estatales y mantente actualizado con las últimas competencias de
              la WCA.
            </p>
            <div className="flex justify-center">
              <Link
                className={buttonVariants({ variant: "default" })}
                href="/rankings/333/single"
              >
                Explorar Rankings
                <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <Image
              alt="Competidores de speedcubing"
              className="object-cover object-center rounded"
              height={900}
              src="/competidores.jpg"
              width={1080}
            />
          </div>
        </div>
      </section>

      <section className="text-muted-foreground body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="!p-4">
              <CardHeader>
                <CardTitle className="!text-lg !text-primary !font-medium !title-font !mb-4">
                  Rankings Estatales
                </CardTitle>
                <Trophy className="w-12 h-12 inline-block mb-4" />
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-base">
                  Ve a los mejores speedcubers de cada estado mexicano en varios
                  eventos de la WCA.
                </p>
              </CardContent>
            </Card>
            <Card className="!p-4">
              <CardHeader>
                <CardTitle className="!text-lg !text-primary !font-medium !title-font !mb-4">
                  Récords Nacionales
                </CardTitle>
                <Clock className="w-12 h-12 inline-block mb-4" />
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-base">
                  Mantente al tanto de los tiempos más rápidos y los mejores
                  promedios establecidos por cuberos mexicanos en competiciones
                  oficiales de la WCA.
                </p>
              </CardContent>
            </Card>
            <Card className="!p-4">
              <CardHeader>
                <CardTitle className="!text-lg !text-primary !font-medium !title-font !mb-4">
                  Próximos Eventos
                </CardTitle>
                <Users className="w-12 h-12 inline-block mb-4" />
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-base">
                  Encuentra información sobre las próximas competiciones de la
                  WCA en México y regístrate para participar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
