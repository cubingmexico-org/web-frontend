import { GitHub } from "@workspace/icons";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Footer() {
  return (
    <footer className="text-muted-foreground body-font">
      <div className="container px-5 py-8 mx-auto">
        <div className="flex items-center sm:flex-row flex-col">
          <Link
            className="flex title-font font-medium items-center md:justify-start justify-center text-primary"
            href="https://github.com/cubingmexico-org"
          >
            <span className="flex gap-2 items-center ml-3 text-xl">
              <GitHub className="size-6" />
              Cubing México
            </span>
          </Link>
          <p className="flex flex-col text-sm text-muted-foreground sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            <span>© {new Date().getFullYear()} Cubing México</span>
            <span className="text-xs text-center sm:text-left">
              Hecho por{" "}
              <Link
                className="hover:underline"
                href="https://www.worldcubeassociation.org/persons/2016TORO03"
              >
                Leonardo Sánchez Del Toro
              </Link>
            </span>
          </p>
        </div>
        <div className="flex justify-center sm:justify-end pt-4">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
