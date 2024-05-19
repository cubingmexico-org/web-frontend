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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Link className='flex items-center' href='/certificates'>
        <Image
          alt="Logo de Cubing México"
          height={50}
          priority
          src="https://storage.googleapis.com/cubingmexico_dev_bucket/img/cubingmexico_logo.svg"
          width={50}
        />
        <h1 className="sm:text-2xl text-xl ml-2">Certificados de la WCA</h1>
      </Link>
      <div className="relative ml-auto grow-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage className="object-cover" src={user.image ?? ''} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hola, {user.name?.split(' ')[0]}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @typescript-eslint/no-misused-promises -- . */}
              <span className='cursor-pointer' onClick={() => signOut()}>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}