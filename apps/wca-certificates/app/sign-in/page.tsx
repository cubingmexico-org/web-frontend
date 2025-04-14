import Image from "next/image";
import Link from "next/link";
import { Icons } from "@workspace/ui/components/icons";
import { SignIn } from "@/components/auth-components";

export default function Page(): JSX.Element {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center">
              <Icons.CubingMexico className="size-72" />
            </div>
            <h1 className="text-3xl font-bold">Inicia Sesión</h1>
            <p className="text-balance text-muted-foreground">
              Serás redirigido a la página de la World Cube Association
            </p>
          </div>
          <div className="grid gap-4">
            <SignIn provider="wca" />
          </div>
          <div className="mt-4 text-center text-sm">
            <p>¿No tienes cuenta de la World Cube Association?</p>
            <Link
              className="underline"
              href="https://www.worldcubeassociation.org/users/sign_up"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          alt="Image"
          className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
          height="1080"
          src="/competidores.jpg"
          width="1920"
        />
      </div>
    </div>
  );
}
