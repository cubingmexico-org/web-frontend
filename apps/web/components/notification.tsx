"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Trophy, X } from "lucide-react";

export function Notification() {
  const [closed, setClosed] = useState(false);

  const registrationOpen = new Date("2025-09-07T19:00:00-07:00");

  if (closed) {
    return null;
  }

  return (
    <div className="bg-accent border-b">
      <div className="container mx-auto px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 text-accent-foreground mr-2 flex-shrink-0" />
            {registrationOpen < new Date() ? (
              <div className="text-sm">
                <span className="font-semibold">¡Atención!</span> Las
                inscripciones para el Mexican Championship 2025 están abiertas.{" "}
                <a
                  href="https://www.worldcubeassociation.org/competitions/MexicanChampionship2025/register"
                  className="underline font-medium hover:text-accent-foreground/50"
                >
                  Inscríbete aquí →
                </a>
              </div>
            ) : (
              <div className="text-sm">
                <span className="font-semibold">¡Atención!</span> Las
                inscripciones para el Mexican Championship 2025 abren en{" "}
                {formatDistanceToNow(registrationOpen, {
                  locale: es,
                })}
                .{" "}
                <a
                  href="https://www.worldcubeassociation.org/competitions/MexicanChampionship2025"
                  className="underline font-medium hover:text-accent-foreground/50"
                >
                  Ver página →
                </a>
              </div>
            )}
          </div>
          <button
            className="ml-4 text-yellow-600 hover:text-yellow-800 focus:outline-none"
            aria-label="Cerrar notificación"
            onClick={() => setClosed(true)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
