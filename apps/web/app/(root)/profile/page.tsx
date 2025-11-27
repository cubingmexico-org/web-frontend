/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { auth } from "@/auth";
import { Profile } from "./_components/profile";
import { getPerson, getStates } from "@/db/queries";
import type { Metadata } from "next";
import { notFound, unauthorized } from "next/navigation";
import { getProfile } from "./_lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();

  const person = await getPerson(session?.user?.id!);

  return {
    title: `${person?.name} | Cubing México`,
    description: `Perfil de ${person?.name}`,
  };
}

export default async function Page() {
  const session = await auth();

  if (!session) {
    unauthorized();
  }

  const person = await getProfile(session.user?.id!);

  if (!person) {
    notFound();
  }

  const states = await getStates();

  return <Profile user={session?.user!} person={person} states={states} />;
}
