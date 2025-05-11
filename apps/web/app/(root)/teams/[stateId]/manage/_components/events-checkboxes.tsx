"use client";

import { useState } from "react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";

const events = [
  "333",
  "222",
  "444",
  "555",
  "666",
  "777",
  "333bf",
  "333fm",
  "333oh",
  "clock",
  "minx",
  "pyram",
  "skewb",
  "sq1",
  "444bf",
  "555bf",
  "333mbf",
];

export function EventsCheckboxes({
  defaultValue,
}: {
  defaultValue?: string[];
}) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    defaultValue || [],
  );

  const eventNames: Record<string, string> = {
    "333": "Cubo 3x3x3",
    "222": "Cubo 2x2x2",
    "444": "Cubo 4x4x4",
    "555": "Cubo 5x5x5",
    "666": "Cubo 6x6x6",
    "777": "Cubo 7x7x7",
    "333bf": "3x3x3 Blindfolded",
    "333fm": "3x3x3 Fewest Moves",
    "333oh": "3x3x3 One-Handed",
    clock: "Clock",
    minx: "Megaminx",
    pyram: "Pyraminx",
    skewb: "Skewb",
    sq1: "Square-1",
    "444bf": "4x4x4 Blindfolded",
    "555bf": "5x5x5 Blindfolded",
    "333mbf": "3x3x3 Multi-Blind",
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">Especialidades</h4>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          name="specialties"
          hidden
          value={selectedEvents}
          readOnly
        />
        {events.map((eventId) => (
          <div key={eventId} className="flex items-center space-x-2">
            <Checkbox
              id={`event-${eventId}`}
              checked={
                selectedEvents.filter((event) => event === eventId).length > 0
              }
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedEvents((prev) => {
                    if (prev.includes(eventId)) {
                      return prev;
                    }
                    return [...prev, eventId];
                  });
                } else {
                  setSelectedEvents((prev) =>
                    prev.filter((event) => event !== eventId),
                  );
                }
              }}
            />
            <Label
              htmlFor={`event-${eventId}`}
              className="flex gap-1 items-center"
            >
              <span className={`cubing-icon event-${eventId}`} />{" "}
              <p className="text-xs">{eventNames[eventId] || eventId}</p>
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
