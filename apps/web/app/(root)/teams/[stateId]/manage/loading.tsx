import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";

export default function Loading() {
  return (
    <main className="grow">
      <div className="bg-muted/75 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs className="w-full" defaultValue="general">
          <div className="overflow-x-auto pb-2">
            <TabsList className="w-full md:w-auto justify-start mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="members">Miembros</TabsTrigger>
              <TabsTrigger value="images">Imágenes</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-10 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Logo del Team</CardTitle>
                  <CardDescription>
                    Sube la imagen del logo de tu team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <Skeleton className="w-40 h-40 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full text-center mx-auto" />
                  <div className="flex justify-center pt-2">
                    <Skeleton className="h-9 w-32" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imagen de Portada</CardTitle>
                  <CardDescription>
                    Sube la imagen de portada de tu team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-md" />
                  <Skeleton className="h-4 w-full text-center mx-auto" />
                  <div className="flex justify-center pt-2">
                    <Skeleton className="h-9 w-36" />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Guías de Imágenes</CardTitle>
                  <CardDescription>
                    Mejores prácticas para imágenes de team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, cardIndex) => (
                      <div key={cardIndex} className="space-y-4">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-48" />
                          <div className="space-y-1">
                            {[...Array(5)].map((_, i) => (
                              <Skeleton key={i} className="h-4 w-full" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
