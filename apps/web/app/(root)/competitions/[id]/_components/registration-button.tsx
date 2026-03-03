"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface RegistrationButtonProps {
  registrationOpen: string;
  registrationClose: string;
  registrationUrl: string;
}

export function RegistrationButton({
  registrationOpen,
  registrationClose,
  registrationUrl,
}: RegistrationButtonProps) {
  const now = new Date();
  const openDate = new Date(registrationOpen);
  const closeDate = new Date(registrationClose);
  const isOpen = now >= openDate && now <= closeDate;

  return isOpen ? (
    <Link
      className={cn(
        buttonVariants({ variant: "default", size: "lg" }),
        "bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white",
      )}
      href={registrationUrl + "/register"}
    >
      Inscribirse ahora
    </Link>
  ) : (
    <Button
      size="lg"
      className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white"
      disabled
    >
      Inscripciones cerradas
    </Button>
  );
}
