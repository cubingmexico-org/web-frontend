/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
/* eslint-disable @typescript-eslint/no-floating-promises -- . */
/* eslint-disable @typescript-eslint/no-unsafe-argument -- . */
/* eslint-disable @typescript-eslint/no-explicit-any -- . */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { auth } from "@/auth"
import { i18n } from "./i18n-config";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  auth(request as any);
  const pathname = request.nextUrl.pathname;

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  // if (
  //   [
  //     '/manifest.json',
  //     '/favicon.ico',
  //     // Your other files in `public`
  //   ].includes(pathname)
  // )
  //   return

  if (
    [
      '/competidores.jpg',
      '/fonts/Inter/Inter-Bold.ttf',
      '/fonts/Inter/Inter-Regular.ttf',
      '/fonts/Kanit/Kanit-Bold.ttf',
      '/fonts/Kanit/Kanit-Regular.ttf',
      '/fonts/Lato/Lato-Bold.ttf',
      '/fonts/Lato/Lato-Regular.ttf',
      '/fonts/Lora/Lora-Bold.ttf',
      '/fonts/Lora/Lora-Regular.ttf',
      '/fonts/MavenPro/MavenPro-Bold.ttf',
      '/fonts/MavenPro/MavenPro-Regular.ttf',
      '/fonts/Merriweather/Merriweather-Bold.ttf',
      '/fonts/Merriweather/Merriweather-Regular.ttf',
      '/fonts/Montserrat/Montserrat-Bold.ttf',
      '/fonts/Montserrat/Montserrat-Regular.ttf',
      '/fonts/Noto_Sans/NotoSans-Bold.ttf',
      '/fonts/Noto_Sans/NotoSans-Regular.ttf',
      '/fonts/Nunito/Nunito-Bold.ttf',
      '/fonts/Nunito/Nunito-Regular.ttf',
      '/fonts/Open_Sans/OpenSans-Bold.ttf',
      '/fonts/Open_Sans/OpenSans-Regular.ttf',
      '/fonts/Oswald/Oswald-Bold.ttf',
      '/fonts/Oswald/Oswald-Regular.ttf',
      '/fonts/Pacifico/Pacifico-Regular.ttf',
      '/fonts/Playfair_Display/PlayfairDisplay-Bold.ttf',
      '/fonts/Playfair_Display/PlayfairDisplay-Regular.ttf',
      '/fonts/Poppins/Poppins-Bold.ttf',
      '/fonts/Poppins/Poppins-Regular.ttf',
      '/fonts/PT_Sans/PTSans-Bold.ttf',
      '/fonts/PT_Sans/PTSans-Regular.ttf',
      '/fonts/Raleway/Raleway-Bold.ttf',
      '/fonts/Raleway/Raleway-Regular.ttf',
      '/fonts/Roboto/Roboto-Bold.ttf',
      '/fonts/Roboto/Roboto-Regular.ttf',
      '/fonts/Roboto_Condensed/RobotoCondensed-Bold.ttf',
      '/fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf',
      '/fonts/Roboto_Mono/RobotoMono-Bold.ttf',
      '/fonts/Roboto_Mono/RobotoMono-Regular.ttf',
      '/fonts/Roboto_Slab/RobotoSlab-Bold.ttf',
      '/fonts/Roboto_Slab/RobotoSlab-Regular.ttf',
      '/fonts/Rubik/Rubik-Bold.ttf',
      '/fonts/Rubik/Rubik-Regular.ttf',
      '/fonts/Ubuntu/Ubuntu-Bold.ttf',
      '/fonts/Ubuntu/Ubuntu-Regular.ttf',
      '/fonts/Work_Sans/WorkSans-Bold.ttf',
      '/fonts/Work_Sans/WorkSans-Regular.ttf',
    ].includes(pathname)
  )
    return

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};