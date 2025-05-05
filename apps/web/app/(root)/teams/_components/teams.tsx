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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teams estatales</h1>
          <p className="text-muted-foreground">
            Descubre y conecta con los Teams de speedcubers en México
          </p>
        </div>
      </div>

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
      </div>
    </>
  );
}
