import { auth } from "@/auth";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { TeamShell } from "./team-shell";
import { getTeamShellData } from "../_lib/queries";

export async function TeamFrame({
  params,
  children,
}: {
  params: Promise<{ stateId: string }>;
  children: ReactNode;
}) {
  const stateId = (await params).stateId;
  const session = await auth();

  const shellData = await getTeamShellData(stateId, session?.user?.id || "");

  if (!shellData) {
    return notFound();
  }

  return (
    <TeamShell stateId={stateId} {...shellData}>
      {children}
    </TeamShell>
  );
}
