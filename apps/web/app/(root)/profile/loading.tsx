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
      <Skeleton className="h-8 w-48 mx-auto mb-6" />

      <Tabs defaultValue="general" className="w-full">
        <div className="border-b mb-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger disabled value="preferences">
              Preferencias
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-64" />
            </div>

            <div>
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
