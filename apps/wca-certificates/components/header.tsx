'use client'

import { signOut } from 'next-auth/react'
import { User } from 'next-auth'
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
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4">
      <Link href='/certificates' className='flex items-center'>
        <Image
          src="https://storage.googleapis.com/cubingmexico_dev_bucket/img/cubingmexico_logo.svg"
          alt="Logo de Cubing México"
          width={50}
          height={50}
          priority
        />
        <h1 className="text-2xl ml-2">Certificados de la WCA</h1>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={user.image as string} className="object-cover" />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Hola, {user.name?.split(' ')[0]}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
          <span onClick={() => signOut()} className='cursor-pointer'>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}