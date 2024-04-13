import { getServerSession, User } from 'next-auth'
import { authOptions } from "@/lib/auth"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card"
import { buttonVariants } from '@repo/ui/button'
import Link from "next/link"
import "@cubing/icons"


export default async function Page() {

  const session = await getServerSession(authOptions)

  const response = await fetch('https://www.worldcubeassociation.org/api/v0/competitions?managed_by_me=true', {
    headers: {
      'Authorization': `Bearer ${session?.token}`,
    },
    cache: 'no-store'
  });

  const data = await response.json();

  return (
    <div className="flex-grow">
      <h1 className="text-3xl font-bold mb-4 text-center">Bienvenido</h1>
      <p className='text-center'>Se detectó que eres organizador en estas competencias:</p>
      <div className='flex flex-wrap justify-center'>
        {
          data ?
            data.map((competition: any, index: number) => (
              <Card key={index} className="w-[350px] m-4">
                <CardHeader>
                  <CardTitle>{competition.name}</CardTitle>
                  <CardDescription>{competition.city}</CardDescription>
                </CardHeader>
                <CardContent>
                  {competition.event_ids.map((event: any, index: number) => (
                    <span key={index} className={`cubing-icon event-${event} m-1`}></span>
                  ))}
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Link href={`/certificates/podium/${competition.id}`} className={`${buttonVariants({ variant: 'default' })} mb-2`}>Certificados de podio</Link>
                  <Link href={`/certificates/participation/${competition.id}`} className={buttonVariants({ variant: 'secondary' })}>Certificados de participación</Link>
                </CardFooter>
              </Card>
            ))
            :
            <p className="text-lg text-center">Parece que no estás organizando ninguna competencia en este momento</p>
        }
      </div>
    </div>
  );
}
