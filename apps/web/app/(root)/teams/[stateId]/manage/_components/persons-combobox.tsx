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

export function PersonsCombobox() {
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [filteredItems, setFilteredItems] = React.useState<
    { id: string; name: string }[]
  >([]);

  // Debounce search with loading simulation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = React.useCallback(
    debounce(async (searchTerm: string) => {
      setIsLoading(true);
      setProgress(0);

      // Simulate a more realistic progress pattern
      const progressSteps = [15, 35, 65, 85, 95] as const;
      let currentStepIndex = 0;

      const interval = setInterval(() => {
        if (currentStepIndex < progressSteps.length) {
          setProgress(progressSteps[currentStepIndex] ?? 0);
          currentStepIndex++;
        }
      }, 150);

      try {
        // Fetch results from the API
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

      setProgress(100);
      setIsLoading(false);
      clearInterval(interval);
    }, 300),
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
      <ComboboxLabel>Competidor</ComboboxLabel>
      <ComboboxAnchor>
        <ComboboxInput placeholder="Buscar competidor..." />
        <ComboboxTrigger>
          <ChevronDown className="h-4 w-4" />
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxContent>
        {isLoading ? (
          <ComboboxLoading value={progress} label="Buscando competidor..." />
        ) : null}
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

function debounce<TFunction extends (...args: never[]) => unknown>(
  func: TFunction,
  wait: number,
): (...args: Parameters<TFunction>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: unknown, ...args: Parameters<TFunction>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
