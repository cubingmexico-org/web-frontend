/* eslint-disable react/no-array-index-key -- . */

import { Medal, User } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card"
import { buttonVariants } from '@repo/ui/button'
import Image from "next/image"
import Link from "next/link"
import type { Competition } from "@/types/competitions";

interface CardCompetitionProps {
  competition: Competition;
  allowPodiumCertificates?: boolean;
  allowParticipationCertificates?: boolean;
};

export function CardCompetition({
  competition,
  allowPodiumCertificates = true,
  allowParticipationCertificates = true
}: CardCompetitionProps): JSX.Element {
  return (
    <Card className='mt-2'>
      <CardHeader>
        <CardTitle>{competition.name}</CardTitle>
        <CardDescription>{competition.city}</CardDescription>
      </CardHeader>
      <CardContent>
        {competition.event_ids.map((event, index: number) => (
          <span className={`cubing-icon event-${event} m-1`} key={index} />
        ))}
      </CardContent>
      <CardFooter className="flex flex-col">
        {allowPodiumCertificates ? (
          <Link className={`${buttonVariants({ variant: 'default' })} mb-2`} href={`/certificates/podium/${competition.id}`}>
            <Medal className="size-4 mr-2" />
            <span>Certificados de podio</span>
          </Link>
        ) : null}
        {allowParticipationCertificates ? (
          <Link className={`${buttonVariants({ variant: 'secondary' })} mb-2`} href={`/certificates/participation/${competition.id}`}>
            <User className="size-4 mr-2" />
            <span>Certificados de participación</span>
          </Link>
        ) : null}
        <Link className={`${buttonVariants({ variant: 'outline' })}`} href={`https://live.worldcubeassociation.org/link/competitions/${competition.id}`}>
          <Image
            alt="WCA Logo"
            height={16}
            src='https://www.worldcubeassociation.org/files/WCAlogo.svg'
            width={16}
          />
          <span className="ml-2">WCA Live</span>
        </Link>
      </CardFooter>
    </Card>
  );
};
