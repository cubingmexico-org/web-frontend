import { Github, Book } from "lucide-react"
import Link from "next/link";

export default function Footer(): JSX.Element {
  return (
    <footer className="flex justify-center text-sm text-gray-500 my-4">
      <div className="flex">
        <Link className="hover:underline hover:cursor-pointer" href="https://github.com/cubingmexico-org/web-frontend/tree/main/apps/wca-certificates">GitHub</Link><Github className="size-4 mx-2" />
      </div>
      <div className="flex">
        <Link className="hover:underline hover:cursor-pointer" href="https://github.com/cubingmexico-org/web-frontend/wiki/Certificados-de-la-WCA">Wiki</Link><Book className="size-4 ml-2" />
      </div>
    </footer>
  );
}