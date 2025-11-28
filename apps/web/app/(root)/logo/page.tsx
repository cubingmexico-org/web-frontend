import { connection } from "next/server";

export default async function Page(): Promise<React.JSX.Element> {
  await connection();

  const currentYear = new Date().getFullYear();

  return (
    <p className="text-sm text-muted-foreground mt-2">
      © {currentYear} Cubing México. Todos los derechos reservados.
    </p>
  );
}
