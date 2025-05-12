import Image from "next/image";
import Link from "next/link";
import { getCompetitions, getPersons } from "./_lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de | Cubing México",
  description:
    "Cubing México es un sitio web de apasionados por el speedcubing y diseñado con el propósito de unir a la comunidad de speedcubers en México.",
};

export default async function Page(): Promise<JSX.Element> {
  const competitions = await getCompetitions();

  const persons = await getPersons();

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-center text-4xl pb-4 font-semibold">
        Acerca de Cubing México
      </h1>
      <p className="pb-2">
        Cubing México es un sitio web de apasionados por el speedcubing y
        diseñado con el propósito de unir a la comunidad de speedcubers en
        México. Nuestra dedicación es inquebrantable y la misión es clara:
        fomentar el crecimiento y la celebración de la prosperidad del
        speedcubing en nuestro país.
      </p>
      <p className="pb-2">
        En el corazón de Cubing México se encuentra una meta esencial:
        proporcionar una fuente integral de información sobre los rankings y
        récords estatales a lo largo del territorio. Nos basamos en los datos
        proporcionados por la{" "}
        <Link
          className="hover:underline text-accent-foreground"
          href="https://www.worldcubeassociation.org"
        >
          World Cube Association
        </Link>
        , que coordina y supervisa 17 eventos diferentes en este apasionante
        deporte. En Cubing México, creemos en la importancia de llevar un
        registro detallado de los logros de nuestros speedcubers y compartir
        estos logros con orgullo.
      </p>
      <p className="pb-2">
        Desde el año 2008, hemos sido testigos de un crecimiento fenomenal en la
        comunidad de speedcubing en México. ¡Un asombroso total de{" "}
        <b>{persons} mexicanos</b> han participado en nada menos que{" "}
        <b>{competitions} competencias oficiales</b> celebradas en en todo el
        país! Estos números son un testimonio del compromiso y la pasión que los
        speedcubers mexicanos tienen por su deporte, y estamos orgullosos de ser
        parte de esta emocionante travesía.
      </p>
      <Image
        alt="Competidores de speedcubing"
        className="w-full object-cover object-center rounded mt-4"
        height={900}
        src="/competidores.jpg"
        width={1080}
        priority
      />
    </main>
  );
}
