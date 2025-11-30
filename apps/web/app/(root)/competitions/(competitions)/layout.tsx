import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Competencias oficiales de la WCA en México
        </h1>
        <p>
          Una competencia oficial de la{" "}
          <Link
            className="hover:underline text-muted-foreground"
            href="https://www.worldcubeassociation.org/"
          >
            World Cube Association
          </Link>{" "}
          es mucho más que resolver cubos; es un evento vibrante donde los
          cuberos de todas las edades y niveles se reúnen para desafiar sus
          habilidades, compartir su pasión y establecer nuevos récords. Descubre
          competencias de velocidad, resolución a ciegas, con una sola mano y
          más. ¡Explora las fechas, ubicaciones y detalles para unirte a la
          comunidad cubera en México y vivir la emoción de la competencia!
        </p>
      </div>
      {children}
    </>
  );
}
