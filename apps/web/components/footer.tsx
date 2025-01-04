import Link from "next/link";

export function Footer() {
  return (
    <footer className="text-muted-foreground body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <Link
          className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"
          href="/"
        >
          <span className="ml-3 text-xl">Cubing México</span>
        </Link>
        <p className="text-sm text-muted-foreground sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © {new Date().getFullYear()} Cubing México —
          <a
            className="text-muted-foreground ml-1"
            href="https://instagram.com/cubingmexico"
            rel="noopener noreferrer"
            target="_blank"
          >
            @cubingmexico
          </a>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <Link className="text-muted-foreground mr-5" href="/privacy">
            Política de Privacidad
          </Link>
          <Link className="text-muted-foreground" href="/terms">
            Términos de Servicio
          </Link>
        </span>
      </div>
    </footer>
  );
}
