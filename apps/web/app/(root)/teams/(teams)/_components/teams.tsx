"use client";

import { useState } from "react";
import { Input } from "@workspace/ui/components/input";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Search } from "lucide-react";
import { TeamCard } from "./team-card";

interface Team {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  coverImage: string | null;
  state: string;
  founded: Date | null;
  isActive: boolean;
  members: number;
}

export function Teams({ teams }: { teams: Team[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && team.isActive) ||
      (activeTab === "inactive" && !team.isActive);
    return matchesSearch && matchesTab;
  });

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">Teams estatales</h1>
        <p className="text-muted-foreground">
          Descubre y conecta con los Teams de speedcubers en México
        </p>
      </div>

      {/* <div className="mb-8 bg-gradient-to-r from-yellow-50 to-green-50 rounded-lg p-6 border border-yellow-100">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <Image
              src="/placeholder.svg"
              alt="Miguel Sánchez"
              className="rounded-full w-24 h-24 border-2 border-yellow-300"
              width={96}
              height={96}
            />
          </div>
          <div>
            <blockquote className="text-lg italic text-gray-700 mb-4">
              &quot;Los teams, esa gente que por placer se reúnen en plazas, que se contagian de entusiasmo al mirar los logros de sus miembros, que empujan a otros y que en conjunto comparten su pasión por el speedcubing.&quot;
            </blockquote>
            <div className="font-semibold">Aru Gordillo</div>
            <div className="text-sm text-muted-foreground">
              Delegada Regional de la WCA en México
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar Teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Tabs
          defaultValue="all"
          className="w-full md:w-auto"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Activos</TabsTrigger>
            <TabsTrigger value="inactive">Inactivos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => (
          <TeamCard
            key={team.id}
            id={team.id}
            name={team.name}
            description={team.description}
            image={team.image}
            coverImage={team.coverImage}
            state={team.state}
            founded={team.founded}
            isActive={team.isActive}
            members={team.members}
          />
        ))}
        {filteredTeams.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-muted-foreground">
              No se encontraron resultados para tu búsqueda.
            </p>
            <p className="text-muted-foreground py-4">
              Intenta ajustar tu búsqueda o verifica la ortografía.
            </p>
            <p className="text-muted-foreground">
              Si no encuentras lo que buscas, considera crear un nuevo Team.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
