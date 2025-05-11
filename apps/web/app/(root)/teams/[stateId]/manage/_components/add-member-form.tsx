"use client";

import React, { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Check, X, UserPlus } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { addMemberFormAction } from "@/app/actions";
import { useActionState } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { EventsCheckboxes } from "./events-checkboxes";
import { MembersTable } from "./members-table";
import { PersonsCombobox } from "./persons-combobox";
import { getMembers, getMembersGenderCounts } from "../../_lib/queries";

export function AddMemberForm({
  stateId,
  promises,
}: {
  stateId: string;
  promises: Promise<
    [
      Awaited<ReturnType<typeof getMembers>>,
      Awaited<ReturnType<typeof getMembersGenderCounts>>,
    ]
  >;
}) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState(addMemberFormAction, {
    defaultValues: {
      stateId,
      personId: "",
      specialties: [],
    },
    success: false,
    errors: null,
  });

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <div>
      {state.success && (
        <div className="container mx-auto py-3">
          <Alert className="bg-green-50 border-green-500">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Éxito</AlertTitle>
            <AlertDescription className="text-green-700">
              Miembro añadido exitosamente.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Miembros del Team</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" type="button">
                <UserPlus />
                Añadir Miembro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <form action={formAction}>
                <input
                  type="hidden"
                  name="stateId"
                  defaultValue={stateId}
                  readOnly
                />
                <DialogHeader>
                  <DialogTitle>Añadir Miembro al Team</DialogTitle>
                  <DialogDescription>
                    Añade un nuevo miembro a tu team
                  </DialogDescription>
                </DialogHeader>
                {!state.success && (
                  <div className="container mx-auto py-3">
                    {state.errors && (
                      <Alert className="bg-red-50 border-red-500">
                        <X className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800">Error</AlertTitle>
                        <AlertDescription className="text-red-700">
                          {Object.values(state.errors).join(", ")}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
                <div className="space-y-4 py-4">
                  <div
                    className="group/field grid gap-2"
                    data-invalid={!!state.errors?.personId}
                  >
                    <PersonsCombobox state={state as never} />
                    {state.errors?.personId && (
                      <p
                        id="error-personId"
                        className="text-destructive text-sm"
                      >
                        {state.errors.personId}
                      </p>
                    )}
                  </div>
                  <EventsCheckboxes />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={pending}>
                    {pending ? (
                      <span className="animate-pulse">Añadiendo...</span>
                    ) : (
                      "Añadir Miembro"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <React.Suspense
            fallback={
              <DataTableSkeleton
                columnCount={7}
                filterCount={2}
                cellWidths={[
                  "10rem",
                  "30rem",
                  "10rem",
                  "10rem",
                  "6rem",
                  "6rem",
                  "6rem",
                ]}
                shrinkZero
              />
            }
          >
            <MembersTable promises={promises} stateId={stateId} />
          </React.Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
