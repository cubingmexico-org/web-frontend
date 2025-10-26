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
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/alert";
import { Discord } from "@workspace/icons";
import { Notification } from "@/components/notification";

export default function Page() {
  return (
    <main className="grow">
      <Notification />

      <section className="text-muted-foreground body-font">
        <div className="container mx-auto py-8 px-4">
          <Alert>
            <Discord className="size-4" />
            <AlertTitle>¡Ahora tenemos servidor de Discord!</AlertTitle>
            <AlertDescription className="inline">
              Únete a nuestra comunidad en{" "}
              <Link
                className="hover:underline text-muted-foreground"
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
          <div className="lg:grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-primary">
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
              priority
            />
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
