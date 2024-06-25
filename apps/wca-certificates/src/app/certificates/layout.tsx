import Header from '@/components/header'
import Footer from '@/components/footer';
import "@cubing/icons"

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {

  return (
    <div className="flex flex-col justify-between w-full h-full min-h-screen">
      <div>
        <Header />
        {children}
      </div>
      <Footer />
    </div>
  );
}
