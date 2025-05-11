"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { User } from "next-auth";
import { Label } from "@workspace/ui/components/label";
import { State } from "@/db/schema";
import { Check, Info, X } from "lucide-react";
import { useActionState } from "react";
import { profileFormAction } from "@/app/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

interface ProfileProps {
  user: User;
  person: {
    id: string;
    name: string | null;
    gender: "m" | "f" | "o" | null;
    stateId: string | null;
  };
  states: State[];
}

export function Profile({ user, person, states }: ProfileProps) {
  const [state, formAction, pending] = useActionState(profileFormAction, {
    defaultValues: {
      stateId: person.stateId || "",
      personId: person.id,
    },
    success: false,
    errors: null,
  });

  return (
    <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2 text-center">{user.name}</h1>

      {person.stateId && (
        <Alert className="bg-yellow-50 border-yellow-200 text-black mb-6">
          <AlertDescription>
            No puedes cambiar tu estado. Contacta a un{" "}
            <a href="" className="text-orange-500 hover:underline">
              administrador
            </a>{" "}
            para cambiar este dato.
          </AlertDescription>
        </Alert>
      )}

      {state.success ? (
        <Alert className="bg-green-50 border-green-500 mb-6">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Éxito</AlertTitle>
          <AlertDescription className="text-green-700">
            Los cambios se han guardado correctamente.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {state.errors && (
            <Alert className="bg-red-50 border-red-500 mb-6">
              <X className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">
                {Object.values(state.errors).join(", ")}
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      <Tabs defaultValue="general" className="w-full">
        <div className="border-b mb-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger
              value="general"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              disabled
              value="preferences"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
            >
              Preferencias
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general">
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="fullName">Nombre</Label>
              <Input id="fullName" value={user.name || ""} disabled />
            </div>

            <div>
              <Label htmlFor="gender">Género</Label>
              <Select defaultValue={person.gender!} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m">Masculino</SelectItem>
                  <SelectItem value="f">Femenino</SelectItem>
                  <SelectItem value="o">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <input
              type="hidden"
              name="personId"
              defaultValue={person.id}
              readOnly
            />

            <div
              className="group/field grid gap-2"
              data-invalid={!!state.errors?.stateId}
            >
              <Label
                htmlFor="state"
                className="group-data-[invalid=true]/field:text-destructive flex items-center gap-2"
              >
                Representando
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Elige bien, cambiarlo requiere contactar a un
                      administrador.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Select
                defaultValue={state.defaultValues.stateId || undefined}
                aria-invalid={!!state.errors?.stateId}
                aria-errormessage="error-stateId"
                name="stateId"
                disabled={!!person.stateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent
                  id="state"
                  className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                >
                  {states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state.errors?.name && (
                <p id="error-name" className="text-destructive text-sm">
                  {state.errors.name}
                </p>
              )}
            </div>

            <div>
              <p className="font-medium">
                Tu ID de la WCA es <span className="font-mono">{user.id}</span>
              </p>
            </div>

            <div>
              <Button
                type="submit"
                disabled={person.stateId !== null || pending}
              >
                {pending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent className="space-y-6" value="preferences">
          <div></div>

          <div>
            <Button>Guardar</Button>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
