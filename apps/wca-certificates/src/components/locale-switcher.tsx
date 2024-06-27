/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Languages } from "lucide-react"
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@repo/ui/dropdown-menu"
import { i18n, type Locale } from "@/i18n-config";
import type { getDictionary } from "@/get-dictionary"

interface LocaleSwitcherProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["locale_switcher"]
}

export default function LocaleSwitcher({ dictionary }: LocaleSwitcherProps): JSX.Element {
  const pathName = usePathname();
  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Languages className="mr-2 h-4 w-4" />{dictionary.language}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {i18n.locales.map((locale) => {
            return (
              <DropdownMenuItem asChild key={locale}>
                <Link href={redirectedPathName(locale)}>{locale}</Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}