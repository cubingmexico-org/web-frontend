import Link from "next/link";

export default function Page(): JSX.Element {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 w-full">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-semibold">Logotipo de Cubing México</h1>
        <p>
          El logo de Cubing México, diseñado por Sofia Celaya Álvarez, combina
          elementos culturales mexicanos con un cubo de Rubik, representando la
          identidad de la comunidad. La forma del logo se asemeja a un elote, un
          elemento culinario tradicionalmente mexicano que con su forma
          semicuadrada, simboliza esta fusión.
        </p>
        <p>
          Si deseas apoyar a la artista detrás del diseño, puedes conectarte con
          Sofia a través de sus redes sociales, que se proporcionan a
          continuación:
        </p>
        <Link
          className="text-2xl hover:underline text-green-500 hover:text-green-700"
          href="https://www.instagram.com/ad_chrofy"
        >
          AD Chrofy
        </Link>
        <p>
          Es importante destacar que el logo es propiedad exclusiva de Cubing
          México y su uso requiere permiso. El logo en formato SVG está
          disponible para su descarga{" "}
          <Link
            className="text-green-500 hover:underline hover:text-green-700"
            href="https://storage.googleapis.com/cubingmexico_dev_bucket/img/cubingmexico_logo.svg"
          >
            aquí
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
