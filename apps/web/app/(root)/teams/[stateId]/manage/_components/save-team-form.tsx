"use client";

import type React from "react";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Mail,
  Instagram,
  UserPlus,
  Trash2,
  Save,
  ArrowLeft,
  Plus,
  Check,
  Phone,
  Facebook,
  ImageIcon,
  X,
} from "lucide-react";
import { Switch } from "@workspace/ui/components/switch";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import {
  deleteTeamCoverAction,
  deleteTeamLogoAction,
  teamFormAction,
} from "@/app/actions";
import { useActionState, useState } from "react";
import { ImageUploader } from "./image-uploader";
import { CoverUploader } from "./cover-uploader";

export default function SaveTeamForm({
  stateId,
  teamData,
}: {
  stateId: string;
  teamData: {
    name: string;
    description: string | null;
    image: string | null;
    coverImage: string | null;
    state: string;
    founded: Date | null;
    socialLinks: {
      email?: string;
      whatsapp?: string;
      facebook?: string;
      instagram?: string;
      twitter?: string;
      tiktok?: string;
    } | null;
    isActive: boolean;
  };
}) {
  const [tab, setTab] = useState("general");
  const [state, formAction, pending] = useActionState(teamFormAction, {
    defaultValues: {
      name: teamData.name,
      description: teamData.description,
      email: teamData.socialLinks?.email,
      whatsapp: teamData.socialLinks?.whatsapp,
      facebook: teamData.socialLinks?.facebook,
      instagram: teamData.socialLinks?.instagram,
      twitter: teamData.socialLinks?.twitter,
      tiktok: teamData.socialLinks?.tiktok,
      founded: teamData.founded
        ? teamData.founded.toISOString().split("T")[0]
        : "",
      isActive: teamData.isActive ? "on" : undefined,
    },
    success: false,
    errors: null,
  });

  return (
    <main className="flex-grow">
      <form action={formAction}>
        <div className="bg-gray-100 border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                    )}
                    href={`/teams/${stateId}`}
                  >
                    <ArrowLeft />
                    Volver al Team
                  </Link>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Gestionar Team: {teamData.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Actualiza la información del Team, gestiona miembros y más
                </p>
              </div>
              {tab === "general" && (
                <div className="flex gap-2">
                  <Link
                    className={cn(buttonVariants({ variant: "outline" }))}
                    href={`/teams/${stateId}`}
                  >
                    Cancelar
                  </Link>
                  <Button disabled={pending} type="submit">
                    {pending ? (
                      <>Guardando...</>
                    ) : (
                      <>
                        <Save />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {state.success ? (
          <div className="container mx-auto px-4 py-3">
            <Alert className="bg-green-50 border-green-500">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Éxito</AlertTitle>
              <AlertDescription className="text-green-700">
                Los cambios se han guardado correctamente.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-3">
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

        <input type="hidden" name="stateId" defaultValue={stateId} readOnly />

        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue={tab} className="w-full" onValueChange={setTab}>
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-full md:w-auto justify-start mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="members">Miembros</TabsTrigger>
                <TabsTrigger value="achievements">Logros</TabsTrigger>
                <TabsTrigger value="images">Imágenes</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Team</CardTitle>
                    <CardDescription>
                      Actualiza la información básica de tu Team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="group/field grid gap-2"
                      data-invalid={!!state.errors?.name}
                    >
                      <Label
                        htmlFor="name"
                        className="group-data-[invalid=true]/field:text-destructive"
                      >
                        Nombre <span aria-hidden="true">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Nombre del Team"
                        className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                        disabled={pending}
                        aria-invalid={!!state.errors?.name}
                        aria-errormessage="error-name"
                        defaultValue={state.defaultValues.name}
                      />
                      {state.errors?.name && (
                        <p id="error-name" className="text-destructive text-sm">
                          {state.errors.name}
                        </p>
                      )}
                    </div>
                    <div className="group/field grid gap-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        name="state"
                        defaultValue={teamData.state}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded">Fecha de fundación</Label>
                      <Input
                        id="founded"
                        name="founded"
                        defaultValue={state.defaultValues.founded}
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div
                      className="group/field grid gap-2"
                      data-invalid={!!state.errors?.description}
                    >
                      <Label
                        htmlFor="description"
                        className="group-data-[invalid=true]/field:text-destructive"
                      >
                        Descripción
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Descripción"
                        className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                        disabled={pending}
                        aria-invalid={!!state.errors?.description}
                        aria-errormessage="error-description"
                        defaultValue={state.defaultValues.description || ""}
                        rows={5}
                      />
                      {state.errors?.description && (
                        <p
                          id="error-description"
                          className="text-destructive text-sm"
                        >
                          {state.errors.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        name="isActive"
                        defaultChecked={
                          state.defaultValues.isActive ? true : false
                        }
                        disabled={pending}
                      />
                      <Label htmlFor="isActive">El Team está activo</Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enlaces Sociales</CardTitle>
                    <CardDescription>
                      Actualiza la información de contacto y redes sociales del
                      Team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="group/field grid gap-2"
                      data-invalid={!!state.errors?.email}
                    >
                      <Label
                        htmlFor="email"
                        className="group-data-[invalid=true]/field:text-destructive"
                      >
                        <Mail className="h-4 w-4 inline-block mr-2" />
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="team@ejemplo.com"
                        className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                        disabled={pending}
                        aria-invalid={!!state.errors?.email}
                        aria-errormessage="error-email"
                        defaultValue={state.defaultValues.email}
                      />
                      {state.errors?.email && (
                        <p
                          id="error-email"
                          className="text-destructive text-sm"
                        >
                          {state.errors.email}
                        </p>
                      )}
                    </div>
                    <div
                      className="group/field grid gap-2"
                      data-invalid={!!state.errors?.whatsapp}
                    >
                      <Label
                        htmlFor="whatsapp"
                        className="group-data-[invalid=true]/field:text-destructive"
                      >
                        <Phone className="h-4 w-4 inline-block mr-2" />
                        WhatsApp
                      </Label>
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        placeholder="+52 55 1234 5678"
                        className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                        disabled={pending}
                        aria-invalid={!!state.errors?.whatsapp}
                        aria-errormessage="error-whatsapp"
                        defaultValue={state.defaultValues.whatsapp}
                      />
                      {state.errors?.whatsapp && (
                        <p
                          id="error-whatsapp"
                          className="text-destructive text-sm"
                        >
                          {state.errors.whatsapp}
                        </p>
                      )}
                    </div>
                    <div
                      className="group/field grid gap-2"
                      data-invalid={!!state.errors?.facebook}
                    >
                      <Label
                        htmlFor="facebook"
                        className="group-data-[invalid=true]/field:text-destructive"
                      >
                        <Facebook className="h-4 w-4 inline-block mr-2" />
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        placeholder="tu.team"
                        className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                        disabled={pending}
                        aria-invalid={!!state.errors?.facebook}
                        aria-errormessage="error-facebook"
                        defaultValue={state.defaultValues.facebook}
                      />
                      {state.errors?.facebook && (
                        <p
                          id="error-facebook"
                          className="text-destructive text-sm"
                        >
                          {state.errors.facebook}
                        </p>
                      )}
                    </div>
                    <div
                      className="group/field grid gap-2"
                      data-invalid={!!state.errors?.instagram}
                    >
                      <Label
                        htmlFor="instagram"
                        className="group-data-[invalid=true]/field:text-destructive"
                      >
                        <Instagram className="h-4 w-4 inline-block mr-2" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        placeholder="@tu.team"
                        className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                        disabled={pending}
                        aria-invalid={!!state.errors?.instagram}
                        aria-errormessage="error-instagram"
                        defaultValue={state.defaultValues.instagram}
                      />
                      {state.errors?.instagram && (
                        <p
                          id="error-instagram"
                          className="text-destructive text-sm"
                        >
                          {state.errors.instagram}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="members">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Miembros del Equipo</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" type="button">
                          <UserPlus />
                          Añadir Miembro
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Añadir Miembro del Equipo</DialogTitle>
                          <DialogDescription>
                            Añade un nuevo miembro a tu equipo
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-member">
                                Seleccionar Usuario
                              </Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un usuario" />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* {availableUsers.map((user) => (
                                      <SelectItem key={user.id} value={user.id.toString()}>
                                        <div className="flex items-center">
                                          <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src={user.image} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          {user.name} ({user.email})
                                        </div>
                                      </SelectItem>
                                    ))} */}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="role">Rol</Label>
                              <Select defaultValue="member">
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">
                                    Administrador
                                  </SelectItem>
                                  <SelectItem value="moderator">
                                    Moderador
                                  </SelectItem>
                                  <SelectItem value="member">
                                    Miembro
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="specialties">
                                Especialidades
                              </Label>
                              <Input
                                id="specialties"
                                placeholder="ej. 3x3, 4x4, OH (separado por comas)"
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button">Añadir Miembro</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent className="px-0 sm:px-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Miembro</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Unido
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Estado
                            </TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* {teamData.members.map((member) => (
                              <TableRow key={member.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={member.image} alt={member.name} />
                                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{member.name}</div>
                                      <div className="text-sm text-muted-foreground">{member.email}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      member.role === "admin"
                                        ? "default"
                                        : member.role === "moderator"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {new Date(member.joinDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <Badge
                                    variant={member.isActive ? "default" : "destructive"}
                                    className={
                                      member.isActive
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : "bg-red-100 text-red-800 hover:bg-red-100"
                                    }
                                  >
                                    {member.isActive ? "Activo" : "Inactivo"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <Pencil className="h-4 w-4" />
                                          <span className="sr-only">Editar</span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Editar Miembro</DialogTitle>
                                          <DialogDescription>Actualiza la información y el rol del miembro</DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4 space-y-4">
                                          <div className="flex items-center gap-4 mb-4">
                                            <Avatar className="h-12 w-12">
                                              <AvatarImage src={member.image} alt={member.name} />
                                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <div className="font-medium">{member.name}</div>
                                              <div className="text-sm text-muted-foreground">{member.email}</div>
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-role">Rol</Label>
                                            <Select defaultValue={member.role}>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un rol" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                                <SelectItem value="moderator">Moderador</SelectItem>
                                                <SelectItem value="member">Miembro</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="edit-specialties">Especialidades</Label>
                                            <Input
                                              id="edit-specialties"
                                              defaultValue={member.specialties.join(", ")}
                                              placeholder="ej. 3x3, 4x4, OH (separado por comas)"
                                            />
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Switch id="edit-active" defaultChecked={member.isActive} />
                                            <Label htmlFor="edit-active">El miembro está activo</Label>
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button type="submit">Guardar Cambios</Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                          <Trash2 className="h-4 w-4" />
                                          <span className="sr-only">Eliminar</span>
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Eliminar Miembro</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            ¿Estás seguro de que quieres eliminar a {member.name} del equipo? Esta acción no se puede deshacer.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                            Eliminar
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))} */}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Roles de Miembros</CardTitle>
                    <CardDescription>
                      Comprender los permisos de los miembros del equipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Administrador</h3>
                      <p className="text-sm text-muted-foreground">
                        Acceso completo para gestionar el equipo, incluyendo
                        añadir/eliminar miembros, editar información del equipo
                        y eliminar el equipo.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Moderador</h3>
                      <p className="text-sm text-muted-foreground">
                        Puede gestionar el contenido del equipo como logros y
                        eventos, pero no puede eliminar el equipo ni gestionar
                        administradores.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Miembro</h3>
                      <p className="text-sm text-muted-foreground">
                        Acceso básico para ver la información del equipo y
                        participar en eventos del equipo.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Logros del Equipo</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" type="button">
                          <Plus />
                          Añadir Logro
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Añadir Logro</DialogTitle>
                          <DialogDescription>
                            Añade un nuevo logro al perfil de tu equipo
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="achievement-title">Título</Label>
                            <Input
                              id="achievement-title"
                              placeholder="ej. Campeonato Nacional"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="achievement-description">
                              Descripción
                            </Label>
                            <Textarea
                              id="achievement-description"
                              placeholder="Describe el logro"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="achievement-date">Fecha</Label>
                              <Input id="achievement-date" type="date" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="achievement-type">Tipo</Label>
                              <Select defaultValue="competition">
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="competition">
                                    Competencia
                                  </SelectItem>
                                  <SelectItem value="record">Récord</SelectItem>
                                  <SelectItem value="milestone">
                                    Hito
                                  </SelectItem>
                                  <SelectItem value="other">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button">Añadir Logro</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* {teamData.achievements.map((achievement) => (
                          <div key={achievement.id} className="flex items-start gap-4 p-4 rounded-lg border">
                            <Trophy className="w-6 h-6 text-yellow-500 mt-1" />
                            <div<main className="flex-grow">
          <div className="bg-gray-100 border-b">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/teams/${stateId}`)}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Volver al Equipo
                    </Button>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold">Gestionar Equipo: {teamData.name}</h1>
                  <p className="text-muted-foreground mt-1">Actualiza la información del equipo, gestiona miembros y más</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => router.push(`/teams/${stateId}`)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveTeamInfo} disabled={isSaving}>
                    {isSaving ? (
                      <>Guardando...</>
                    ) : (
                      <>
                        <Save />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
    
          {saveSuccess && (
            <div className="container mx-auto px-4 py-3">
              <Alert className="bg-green-50 border-green-500">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Éxito</AlertTitle>
                <AlertDescription className="text-green-700">Tus cambios se han guardado correctamente.</AlertDescription>
              </Alert>
            </div>
          )}
    
          <div className="container mx-auto px-4 py-6">
            <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
              <div className="overflow-x-auto pb-2">
                <TabsList className="w-full md:w-auto justify-start mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="members">Miembros</TabsTrigger>
                  <TabsTrigger value="achievements">Logros</TabsTrigger>
                  <TabsTrigger value="events">Eventos</TabsTrigger>
                  <TabsTrigger value="images">Imágenes</TabsTrigger>
                </TabsList>
              </div>
    
              <TabsContent value="general">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Información del Equipo</CardTitle>
                      <CardDescription>Actualiza la información básica de tu equipo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Equipo</Label>
                        <Input id="name" name="name" value={teamData.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Ubicación</Label>
                        {/* <Input id="location" name="location" value={teamData.location} /> */}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Consejos para Logros</CardTitle>
                    <CardDescription>
                      Mejores prácticas para mostrar los logros del equipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Sé Específico</h3>
                      <p className="text-sm text-muted-foreground">
                        Incluye detalles específicos como nombres de
                        competiciones, fechas y ubicaciones.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">
                        Destaca los Esfuerzos del Equipo
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Enfócate en los logros del equipo en lugar de los logros
                        individuales.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">
                        Usa un Formato Consistente
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mantén las descripciones de los logros consistentes en
                        estilo y longitud.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">
                        Incluye Contenido Visual
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Considera agregar fotos de eventos para hacer los logros
                        más atractivos.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="images">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Logo del Equipo</CardTitle>
                    <CardDescription>
                      Sube la imagen del logo de tu equipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <div className="relative w-40 h-40">
                        <Image
                          src={teamData.image || "/placeholder.svg"}
                          alt="Logo del equipo"
                          className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                          layout="fill"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                          <ImageUploader stateId={stateId} />
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Tamaño recomendado: 400x400 píxeles (cuadrado)
                    </div>
                    <div className="flex justify-center pt-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            type="button"
                            disabled={!teamData.image}
                          >
                            <Trash2 />
                            Eliminar Logo
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Estás completamente seguro?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará el logo de tu team. No
                              podrás deshacer esta acción.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                await deleteTeamLogoAction(stateId);
                              }}
                            >
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Imagen de Portada</CardTitle>
                    <CardDescription>
                      Sube la imagen de portada de tu equipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative h-48 w-full overflow-hidden rounded-md border border-gray-200">
                      <Image
                        src={teamData.coverImage || "/placeholder.svg"}
                        alt="Portada del equipo"
                        className="w-full h-full object-cover"
                        layout="fill"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <CoverUploader stateId={stateId} />
                      </div>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                      Tamaño recomendado: 1200x400 píxeles (relación 3:1)
                    </div>
                    <div className="flex justify-center pt-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            disabled={!teamData.coverImage}
                          >
                            <Trash2 />
                            Eliminar Portada
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Estás completamente seguro?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará el logo de tu team. No
                              podrás deshacer esta acción.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                await deleteTeamCoverAction(stateId);
                              }}
                            >
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Guías de Imágenes</CardTitle>
                    <CardDescription>
                      Mejores prácticas para imágenes de equipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold flex items-center">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Guías para el Logo
                          </h3>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Usa una imagen cuadrada (proporción 1:1)</li>
                            <li>Manténlo simple y reconocible</li>
                            <li>
                              Asegúrate de que se vea bien en tamaños pequeños
                            </li>
                            <li>Usa formato PNG para mejor calidad</li>
                            <li>Tamaño máximo del archivo: 2MB</li>
                          </ul>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold flex items-center">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Guías para la Imagen de Portada
                          </h3>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>
                              Usa una imagen ancha (proporción recomendada 3:1)
                            </li>
                            <li>Elige imágenes de alta resolución</li>
                            <li>Evita texto en la imagen</li>
                            <li>Usa formato JPG para fotos</li>
                            <li>Tamaño máximo del archivo: 5MB</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </main>
  );
}
