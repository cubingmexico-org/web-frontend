import Image from "next/image"
import Link from "next/link"
import UserButton from './user-button'

export default function Header(): JSX.Element {
  return (
    <header className="sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 max-w-3xl px-4 mx-auto sm:px-6">
        <Link className='flex items-center' href='/certificates'>
          <Image
            alt="Logo de Cubing México"
            height={50}
            priority
            src="/cubingmexico_logo.svg"
            width={50}
          />
          <h1 className="sm:text-2xl text-xl ml-2">Certificados de la WCA</h1>
        </Link>
        <UserButton />
      </div>
    </header>
  );
}