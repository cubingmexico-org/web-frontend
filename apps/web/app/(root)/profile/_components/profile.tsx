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
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { User } from "next-auth";
import { Label } from "@workspace/ui/components/label";
import { State } from "@/db/schema";

interface ProfileProps {
  user: User;
  person: {
    id: string;
    name: string | null;
    gender: "m" | "f" | "o" | null;
    state: string | null;
  };
  states: State[];
}

export function Profile({ user, person, states }: ProfileProps) {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2 text-center">{user.name}</h1>

      {person.state && (
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

        <TabsContent className="space-y-6" value="general">
          <div>
            <Label htmlFor="fullName">Nombre</Label>
            <Input
              id="fullName"
              value={user.name || ""}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div>
            <Label htmlFor="gender">Género</Label>
            <Select defaultValue={person.gender!} disabled>
              <SelectTrigger className="bg-gray-100">
                <SelectValue placeholder="Selecciona género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m">Masculino</SelectItem>
                <SelectItem value="f">Femenino</SelectItem>
                <SelectItem value="o">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="state">Representando</Label>
            <Select defaultValue={person.state || undefined} disabled>
              <SelectTrigger className="bg-gray-100">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="font-medium">
              Tu ID de la WCA es <span className="font-mono">{user.id}</span>
            </p>
          </div>

          <div>
            <Button disabled>Guardar</Button>
          </div>
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
