import { getServerSession } from 'next-auth'
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
import { authOptions } from "@/lib/auth"
import "@cubing/icons"


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Return type is inferred
export default async function Page() {

  const session = await getServerSession(authOptions)

  const response = await fetch('https://www.worldcubeassociation.org/api/v0/competitions?managed_by_me=true', {
    headers: {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- This is the expected template
      'Authorization': `Bearer ${session?.token}`,
    },
    cache: 'no-store'
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- This is the expected assignment
  const data = await response.json();

  return (
    <div className="flex-grow">
      <h1 className="text-3xl font-bold mb-4 text-center">Bienvenido</h1>
      <p className='text-center'>Se detectó que eres organizador en estas competencias:</p>
      <div className='flex flex-wrap justify-center'>
        {
          data ?
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- This is the expected call
            data.map((competition: { name: string; city: string; event_ids: string[]; id: string }, index: number) => (
              // eslint-disable-next-line react/no-array-index-key -- This array will not change
              <Card className="w-[350px] m-4" key={index}>
                <CardHeader>
                  <CardTitle>{competition.name}</CardTitle>
                  <CardDescription>{competition.city}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* eslint-disable-next-line @typescript-eslint/no-shadow -- . */}
                  {competition.event_ids.map((event, index: number) => (
                    // eslint-disable-next-line react/no-array-index-key -- This array will not change
                    <span className={`cubing-icon event-${event} m-1`} key={index} />
                  ))}
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Link className={`${buttonVariants({ variant: 'default' })} mb-2`} href={`/certificates/podium/${competition.id}`}>Certificados de podio</Link>
                  <Link className={buttonVariants({ variant: 'secondary' })} href={`/certificates/participation/${competition.id}`}>Certificados de participación</Link>
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
