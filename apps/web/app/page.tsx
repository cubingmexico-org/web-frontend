import Image from "next/image";
import { ArrowRight, Trophy, Users, Clock } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

export default function Page(): JSX.Element {
  return (
    <main className="flex-grow">
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Cubing México
              <br className="hidden lg:inline-block" />
              Rankings y Récords Estatales Mexicanos
            </h1>
            <p className="mb-8 leading-relaxed">
              Descubre a los mejores speedcubers en México, sigue los récords estatales y mantente actualizado con los últimos eventos y logros de la WCA.
            </p>
            <div className="flex justify-center">
              <Button className="!inline-flex !text-white !bg-green-500 !border-0 !py-2 !px-6 focus:!outline-none hover:!bg-green-600 !rounded !text-lg">
                Explorar Rankings
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <Image
              alt="Cubo de Rubik"
              className="object-cover object-center rounded"
              height={900}
              src="/competidores.jpg"
              width={1080}
            />
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            <Card className="!p-4 md:!w-1/3">
              <CardHeader>
                <CardTitle className="!text-lg !text-gray-900 !font-medium !title-font !mb-4">
                  Rankings Estatales
                </CardTitle>
                <Trophy className="w-12 h-12 inline-block mb-4" />
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-base">
                  Ve a los mejores speedcubers de cada estado mexicano en varios eventos de la WCA.
                </p>
              </CardContent>
            </Card>
            <Card className="!p-4 md:!w-1/3">
              <CardHeader>
                <CardTitle className="!text-lg !text-gray-900 !font-medium !title-font !mb-4">
                  Récords Nacionales
                </CardTitle>
                <Clock className="w-12 h-12 inline-block mb-4" />
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-base">
                  Mantente al tanto de los tiempos más rápidos y los mejores promedios establecidos por cuberos mexicanos en competiciones oficiales de la WCA.
                </p>
              </CardContent>
            </Card>
            <Card className="!p-4 md:!w-1/3">
              <CardHeader>
                <CardTitle className="!text-lg !text-gray-900 !font-medium !title-font !mb-4">
                  Próximos Eventos
                </CardTitle>
                <Users className="w-12 h-12 inline-block mb-4" />
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-base">
                  Encuentra información sobre las próximas competiciones de la WCA en México y regístrate para participar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}