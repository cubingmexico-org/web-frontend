import Link from "next/link";

export default function Page(): JSX.Element {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-center text-4xl pb-4 font-semibold">
        Logotipo de Cubing México
      </h1>
      <p className="text-center pb-2">
        El logo de Cubing México, diseñado por Sofia Celaya Álvarez, combina
        elementos culturales mexicanos con un cubo de Rubik, representando la
        identidad de la comunidad. La forma del logo se asemeja a un elote, un
        elemento culinario tradicionalmente mexicano que con su forma
        semicuadrada, simboliza esta fusión.
      </p>
      <p className="text-center pb-2">
        Si deseas apoyar a la artista detrás del diseño, puedes conectarte con
        Sofia a través de sus redes sociales, que se proporcionan a
        continuación:
      </p>
      <Link href="https://www.instagram.com/ad_chrofy">AD Chrofy</Link>
      <p>
        Es importante destacar que el logo es propiedad exclusiva de Cubing
        México y su uso requiere permiso. El logo en formato SVG está disponible
        para su descarga aquí.
      </p>
    </main>
  );
}
