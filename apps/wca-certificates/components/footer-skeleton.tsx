import { Skeleton } from "@workspace/ui/components/skeleton";
import { Discord, Facebook, GitHub, Instagram } from "@workspace/icons";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function FooterSkeleton() {
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
          <Skeleton className="h-4.5 w-39" />
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start gap-3">
            <Link
              href="https://facebook.com/cubingmexico"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://instagram.com/cubingmexico"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://discord.gg/N9KcpWngz7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Discord className="h-5 w-5" />
            </Link>
          </span>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>
            Hecho con ❤️ por{" "}
            <Link
              href="https://www.worldcubeassociation.org/persons/2016TORO03"
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leonardo Sánchez Del Toro
            </Link>
          </p>
        </div>
        <div className="flex justify-center sm:justify-end pt-4">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
