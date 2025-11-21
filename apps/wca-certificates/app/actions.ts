"use server";

import { signIn } from "@/auth";
import { revalidateTag } from "next/cache";

export async function signInAction(provider?: string): Promise<void> {
  await signIn(provider);
}

export async function revalidateWCIF(competitionId: string): Promise<void> {
  revalidateTag(`wcif-${competitionId}`);
}
