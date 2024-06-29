import Link from "next/link"
import { Icons } from "@repo/ui/icons"
import type { getDictionary } from "@/get-dictionary"
import UserButton from './user-button'

interface HeaderProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
}

export default function Header({ dictionary }: HeaderProps): JSX.Element {
  return (
    <header className="sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 max-w-3xl px-4 mx-auto sm:px-6">
        <Link className='flex items-center' href='/certificates'>
          <Icons.CubingMexico className="size-12" />
          <h1 className="sm:text-2xl text-xl ml-2 font-bold">{dictionary.header.title}</h1>
        </Link>
        <UserButton dictionary={dictionary} />
      </div>
    </header>
  );
}