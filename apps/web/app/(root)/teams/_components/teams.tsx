"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
// import { Badge } from "@workspace/ui/components/badge"
import { Users, MapPin, Calendar, Search } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";

interface Team {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
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
        <Button className="bg-green-500 hover:bg-green-600">
          Registra a tu Team
        </Button>
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
          <Card key={team.state} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={team.image ?? undefined}
                    alt={team.name ?? undefined}
                  />
                  <AvatarFallback>
                    {team.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {team.state}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {team.members} miembros
                </div>
                {team.founded ? (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Desde{" "}
                    {team.founded.toLocaleDateString("es-ES", {
                      year: "numeric",
                    })}
                  </div>
                ) : null}
              </div>
              {/* <div className="mb-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Trophy className="w-4 h-4 mr-1" />
                  Logros recientes
                </h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {team.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div> */}
              {/* <div>
                <h3 className="font-semibold mb-2">Miembros destacados</h3>
                <div className="space-y-2">
                  {team.topMembers.map((member, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{member.name}</div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{member.specialty}</Badge>
                        <Badge variant="outline">{member.achievement}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
            </CardContent>
            <CardFooter>
              <Link
                className={cn("w-full", buttonVariants({ variant: "outline" }))}
                href={`/teams/${team.id}`}
              >
                Ver perfil del Team
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
