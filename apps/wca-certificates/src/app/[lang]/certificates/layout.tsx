import Header from '@/components/header'
import Footer from '@/components/footer';
import "@cubing/icons"
import type { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';

interface LayoutProps {
  params: {
    lang: Locale
  },
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps): Promise<JSX.Element> {
  const dictionary = await getDictionary(params.lang);

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
