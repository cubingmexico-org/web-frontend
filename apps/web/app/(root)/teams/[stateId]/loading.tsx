import { Card, CardHeader, CardContent } from "@workspace/ui/components/card";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";

export default function Loading() {
  return (
    <>
      <div className="relative h-[400px] bg-gray-200">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-6">
          <div className="container mx-auto flex flex-col sm:flex-row items-end gap-6">
            <div className="flex gap-6 w-full">
              <Skeleton className="h-24 w-24 rounded-full border-4 border-white" />
              <div className="text-white mb-2 space-y-2">
                <Skeleton className="h-8 w-48" />
                <div className="flex flex-col sm:flex-row items-start sm:gap-4 gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <ScrollArea className="max-w-screen">
            <TabsList className="w-full justify-start mb-8">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="members">Miembros</TabsTrigger>
              <TabsTrigger value="competitions">Competencias</TabsTrigger>
              <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-32" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-2">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitions">
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, cardIndex) => (
                <Card key={cardIndex}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-lg border"
                      >
                        <Skeleton className="w-6 h-6 shrink-0" />
                        <div className="grow space-y-2">
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                        <Skeleton className="h-10 w-28 shrink-0" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-5 h-5" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
