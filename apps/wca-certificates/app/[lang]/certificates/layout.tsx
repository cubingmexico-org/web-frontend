import Header from "@/components/header";
import Footer from "@/components/footer";
import "@cubing/icons";
import type { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

type Params = Promise<{ lang: Locale }>;

export default async function Layout({
  params,
  children,
}: {
  params: Params;
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="flex flex-col justify-between w-full h-full min-h-screen">
      <div>
        <Header dictionary={dictionary} />
        {children}
      </div>
      <Footer dictionary={dictionary} />
    </div>
  );
}
