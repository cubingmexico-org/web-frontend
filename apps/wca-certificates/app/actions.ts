"use server";

import { signIn } from "@/auth";

export async function signInAction(provider?: string): Promise<void> {
  await signIn(provider);
}
