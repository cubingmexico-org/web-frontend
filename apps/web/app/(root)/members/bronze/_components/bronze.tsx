"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { Medal, Trophy, MapPin } from "lucide-react";
import Link from "next/link";

export function Bronze({
  members,
}: {
  members: {
    id: string;
    name: string | null;
    gender: "m" | "f" | "o" | null;
    state: string | null;
  }[];
}) {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Miembros Bronce</h1>
          <p className="text-muted-foreground">
            Cuberos de élite que han completado los 17 eventos oficiales de la
            WCA
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-lg p-6 border border-amber-200 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-amber-200 p-2 rounded-full">
            <Medal className="h-8 w-8 text-amber-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-2">
              ¿Qué es un Miembro Bronce?
            </h2>
            <p className="text-amber-800 mb-3">
              Según{" "}
              <Link
                className="font-semibold hover:underline"
                href="https://sam596.github.io/WCA-Stats/mollerzmembership/Bronze"
              >
                Mollerz Memberships
              </Link>
              . Un Miembro Bronce es un speedcuber que ha completado
              oficialmente los 17 eventos reconocidos por la World Cube
              Association (WCA). Esto representa un logro extraordinario que
              demuestra versatilidad, dedicación y excelencia en el speedcubing.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-amber-700">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 mr-1" />
                <span>
                  <strong>{members.length}</strong> miembros en México
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="size-16">
                    <AvatarImage src="" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-1">
                    <Medal className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {member.state}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              <Link
                className={cn("w-full", buttonVariants({ variant: "outline" }))}
                href={`/persons/${member.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver perfil
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-muted/50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              ¿Cómo convertirse en Miembro Bronce?
            </h2>
            <p className="mb-4">
              Para convertirte en Miembro Bronce, debes participar oficialmente
              en los 17 eventos reconocidos por la WCA y obtener al menos un
              resultado válido en cada uno. Esto incluye eventos poco comunes
              como 5x5 Blindfolded y 3x3 Multi-Blind, que no se ofrecen en todas
              las competencias.
            </p>
            <p>
              Consulta el calendario de competencias para encontrar eventos
              específicos y planifica tu camino hacia este prestigioso logro.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
