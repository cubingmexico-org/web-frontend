import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icons } from "@workspace/ui/components/icons";
import { auth } from "@/auth";
import { SignIn } from "@/components/auth-components";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";

type Params = Promise<{ lang: Locale }>;

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  const session = await auth();

  if (session) {
    redirect("/certificates");
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center">
              <Icons.CubingMexico className="size-72" />
            </div>
            <h1 className="text-3xl font-bold">
              {dictionary.signin.signInTitle}
            </h1>
            <p className="text-balance text-muted-foreground">
              {dictionary.signin.signInDescription}
            </p>
          </div>
          <div className="grid gap-4">
            <SignIn dictionary={dictionary.auth_components} provider="wca" />
          </div>
          <div className="mt-4 text-center text-sm">
            <p>{dictionary.signin.noAccountQuestion}</p>
            <Link
              className="underline"
              href="https://www.worldcubeassociation.org/users/sign_up"
            >
              {dictionary.signin.signUp}
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
