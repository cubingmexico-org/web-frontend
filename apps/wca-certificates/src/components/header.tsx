'use client'

import { signOut } from 'next-auth/react'
import type { User } from 'next-auth'
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import {
  LogOut
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"


interface HeaderProps {
  user: User;
}

export default function Header({
  user
}: HeaderProps): JSX.Element {
  return (
    <header className="flex items-center justify-between p-4">
      <Link className='flex items-center' href='/certificates'>
        <Image
          alt="Logo de Cubing México"
          height={50}
          priority
          src="https://storage.googleapis.com/cubingmexico_dev_bucket/img/cubingmexico_logo.svg"
          width={50}
        />
        <h1 className="text-2xl ml-2">Certificados de la WCA</h1>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage className="object-cover" src={
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- We know the user has an image
              user.image!
            } />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Hola, {user.name?.split(' ')[0]}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @typescript-eslint/no-misused-promises -- . */}
            <span className='cursor-pointer' onClick={() => signOut()}>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}