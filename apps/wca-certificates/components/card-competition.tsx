import { Medal, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { buttonVariants } from "@workspace/ui/components/button";
import Link from "next/link";
import { Icons } from "@workspace/ui/components/icons";
import type { Competition } from "@/types/competitions";
import type { getDictionary } from "@/get-dictionary";

interface CardCompetitionProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["card_competition"];
  competition: Competition;
  allowDesign?: boolean;
  allowPodiumCertificates?: boolean;
  allowParticipationCertificates?: boolean;
}

export function CardCompetition({
  dictionary,
  competition,
  allowDesign = false,
  allowPodiumCertificates = true,
  allowParticipationCertificates = true,
}: CardCompetitionProps): JSX.Element {
  return (
    <Card className="mt-2">
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
          <Link
            className={`${buttonVariants({ variant: "default" })} mb-2`}
            href={`/certificates/podium/${competition.id}`}
          >
            <Medal className="size-4 mr-2" />
            <span>{dictionary.certificates.podium}</span>
          </Link>
        ) : null}
        {allowParticipationCertificates ? (
          <Link
            className={`${buttonVariants({ variant: "secondary" })} mb-2`}
            href={`/certificates/participation/${competition.id}`}
          >
            <User className="size-4 mr-2" />
            <span>{dictionary.certificates.participation}</span>
          </Link>
        ) : null}
        {allowDesign ? (
          <>
            <Link
              className={`${buttonVariants({ variant: "default" })} mb-2`}
              href={`/certificates/design/podium/${competition.id}`}
            >
              <Medal className="size-4 mr-2" />
              <span>{dictionary.certificates.designPodium}</span>
            </Link>
            <Link
              className={`${buttonVariants({ variant: "secondary" })} mb-2`}
              href={`/certificates/design/participation/${competition.id}`}
            >
              <User className="size-4 mr-2" />
              <span>{dictionary.certificates.designParticipation}</span>
            </Link>
          </>
        ) : null}
        <Link
          className={`${buttonVariants({ variant: "outline" })}`}
          href={`https://live.worldcubeassociation.org/link/competitions/${competition.id}`}
        >
          <Icons.WcaMonochrome className="size-4" />
          <span className="ml-2">{dictionary.liveLink}</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
