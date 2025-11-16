import Image from "next/image";
import {
  ArrowRight,
  Users,
  Clock,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Link from "next/link";
// import { Notification } from "@/components/notification";

export default function Page() {
  return (
    <main className="grow">
      {/* <Notification /> */}

      <section className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden">
        <Image
          alt="Competidores de speedcubing"
          className="object-cover object-center"
          fill
          src="/competidores.jpg"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Cubing México
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Descubre los mejores cuberos, récords y competencias de México
            </p>
            <Link
              href="/rankings/333/single"
              className={buttonVariants({ size: "lg" })}
            >
              Ver Rankings <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="text-muted-foreground body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Link href="/rankings/333/single">
              <Card className="p-4 transition-all hover:border-primary hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-primary font-medium title-font mb-4">
                    Rankings Estatales
                  </CardTitle>
                  <ChartNoAxesColumnIncreasing className="w-12 h-12 inline-block mb-4" />
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-base">
                    Ve a los mejores speedcubers de cada estado mexicano en
                    varios eventos de la WCA.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/records">
              <Card className="p-4 transition-all hover:border-primary hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-primary font-medium title-font mb-4">
                    Récords Nacionales
                  </CardTitle>
                  <Clock className="w-12 h-12 inline-block mb-4" />
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-base">
                    Mantente al tanto de los tiempos más rápidos y los mejores
                    promedios establecidos por cuberos mexicanos en competencias
                    oficiales de la WCA.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/competitions">
              <Card className="p-4 transition-all hover:border-primary hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-primary font-medium title-font mb-4">
                    Próximas Competencias
                  </CardTitle>
                  <Users className="w-12 h-12 inline-block mb-4" />
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-base">
                    Encuentra información sobre las próximas competencias de la
                    WCA en México y regístrate para participar.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
