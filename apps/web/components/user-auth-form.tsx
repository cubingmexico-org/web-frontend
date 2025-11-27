"use client";

import * as React from "react";
import * as z from "zod";
import { toast } from "sonner";
import { SignInButton } from "./sign-in-button";
import { signInAction } from "@/app/actions";

export function UserAuthForm(): React.JSX.Element {
  async function signInWithWithWCA(): Promise<void> {
    try {
      await signInAction("wca");
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error);
        toast.error("Failed to sign in with WCA", {
          description: "Please try again",
        });
      }
    }
  }

  return (
    <form action={signInWithWithWCA} className="grid">
      <SignInButton />
    </form>
  );
}
