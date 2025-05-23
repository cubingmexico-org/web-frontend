"use client";

import {
  Combobox,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxLoading,
  ComboboxTrigger,
} from "@workspace/ui/components/combobox";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { getPersonsWithoutState } from "../_lib/actions";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export function PersonsCombobox({
  state,
}: {
  state: {
    defaultValues: Record<string, string>;
    success: boolean;
    errors: {
      [key: string]: string[] | null;
    };
  };
}) {
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState<
    { id: string; name: string }[]
  >([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = React.useCallback(
    useDebouncedCallback(async (searchTerm: string) => {
      setIsLoading(true);

      try {
        const results = (await getPersonsWithoutState({
          search: searchTerm,
        })) as {
          id: string;
          name: string;
        }[];
        setFilteredItems(results);
      } catch (error) {
        console.error("Error fetching persons:", error);
        setFilteredItems([]);
      }

      setIsLoading(false);
    }, 1000),
    [],
  );

  const onInputValueChange = React.useCallback(
    (value: string) => {
      setSearch(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  return (
    <Combobox
      value={value}
      onValueChange={setValue}
      inputValue={search}
      onInputValueChange={onInputValueChange}
      manualFiltering
    >
      <input type="text" name="personId" hidden defaultValue={value} />
      <ComboboxLabel className="group-data-[invalid=true]/field:text-destructive">
        Competidor
      </ComboboxLabel>
      <ComboboxAnchor>
        <ComboboxInput
          placeholder="Buscar competidor..."
          className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
          aria-invalid={!!state.errors?.personId}
          aria-errormessage="error-personId"
        />
        <ComboboxTrigger>
          <ChevronDown className="h-4 w-4" />
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxContent>
        {isLoading ? <ComboboxLoading label="Buscando competidor..." /> : null}
        <ComboboxEmpty keepVisible={!isLoading && filteredItems.length === 0}>
          No se encontraron competidores.
        </ComboboxEmpty>
        {!isLoading &&
          filteredItems.map((item) => (
            <ComboboxItem key={item.id} value={item.id} outset>
              {item.name} ({item.id})
            </ComboboxItem>
          ))}
      </ComboboxContent>
    </Combobox>
  );
}
