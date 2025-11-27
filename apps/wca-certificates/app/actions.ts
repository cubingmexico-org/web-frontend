"use server";

import { signIn } from "@/auth";
import { updateTag } from "next/cache";

export async function signInAction(provider?: string): Promise<void> {
  await signIn(provider);
}

export async function revalidateWCIF(competitionId: string): Promise<void> {
  updateTag(`wcif-${competitionId}`);
}
