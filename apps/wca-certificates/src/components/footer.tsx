import Link from "next/link";
import { Github, Book } from "lucide-react"
import { getDictionary } from "@/get-dictionary";

interface FooterProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

export default function Footer({ dictionary }: FooterProps): JSX.Element {
  return (
    <footer className="flex justify-center text-sm text-muted-foreground my-4">
      <div className="flex">
        <Link className="hover:underline hover:cursor-pointer" href="https://github.com/cubingmexico-org/web-frontend/tree/main/apps/wca-certificates">{dictionary.footer.github}</Link><Github className="size-4 mx-2" />
      </div>
      <div className="flex">
        <Link className="hover:underline hover:cursor-pointer" href={dictionary.footer.wikiHref}>{dictionary.footer.wiki}</Link><Book className="size-4 mx-2" />
      </div>
      <div className="flex">
        <p>{dictionary.footer.version}</p>
      </div>
    </footer>
  );
}