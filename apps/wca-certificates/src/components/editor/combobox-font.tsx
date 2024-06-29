"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@repo/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@repo/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/popover"
import { cn } from "@repo/ui/utils"
import { fonts } from "@/lib/fonts"
import type { getDictionary } from "@/get-dictionary"

interface ComboboxFontProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["certificates"]["podium"]["document_settings"]["tiptap"]["toolbar"]["comboboxFont"]
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}

export function ComboboxFont({
  dictionary,
  value,
  setValue,
  disabled,
}: ComboboxFontProps): JSX.Element {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          role="combobox"
          variant="outline"
        >
          {value
            ? <p style={{
              fontFamily: fonts.find((font) => font.value === value)?.value,
            }}>{fonts.find((font) => font.value === value)?.label}</p>
            : dictionary.searchFont}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={dictionary.searchFont} />
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {fonts.map((font) => (
                <CommandItem
                  key={font.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  value={font.value}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === font.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <p style={{
                    fontFamily: font.value,
                  }}>{font.label}</p>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
