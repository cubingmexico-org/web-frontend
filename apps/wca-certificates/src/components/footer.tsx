import Link from "next/link";
import { Github, Facebook, Instagram } from "lucide-react"
import type { getDictionary } from "@/get-dictionary";
import { ModeToggle } from "./mode-toggle";

interface FooterProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

export default function Footer({ dictionary }: FooterProps): JSX.Element {
  return (
    <footer className="flex justify-between text-sm text-muted-foreground m-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          <Link className="hover:underline hover:cursor-pointer" href="https://github.com/cubingmexico-org/web-frontend/tree/main/apps/wca-certificates">{dictionary.footer.github}</Link><Github className="size-4 mx-2" />
        </div>
        <div className="font-light">
          {dictionary.footer.version}
        </div>
        <div className="flex gap-2">
          <Link href="https://www.facebook.com/cubingmexico"><Facebook className="size-4 hover:text-primary" /></Link><Link href="https://www.instagram.com/cubingmexico"><Instagram className="size-4 hover:text-primary" /></Link>
        </div>
      </div>
      <ModeToggle />
    </footer>
  );
}