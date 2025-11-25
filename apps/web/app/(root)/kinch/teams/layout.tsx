import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@workspace/ui/components/table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinch Ranks de Teams | Cubing México",
  description:
    "Encuentra el ranking de los mejores equipos de speedcubing en México en cada evento de la WCA. Filtra por estado, género y más.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grow container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">Kinch Ranks de Teams</h1>
        <p>
          Los Kinch Ranks de teams son una forma de medir el rendimiento de un
          team en comparación con otros teams. Se calcula tomando el mejor
          resultado de cada miembro del team en cada evento y comparándolo con
          el mejor resultado nacional en ese evento. El resultado se expresa
          como un porcentaje, donde 100% significa que el team tiene el mejor
          resultado nacional en ese evento. Un porcentaje más bajo indica un
          rendimiento inferior en comparación con el mejor resultado nacional.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>
              <span className="cubing-icon event-333" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-222" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-444" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-555" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-666" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-777" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-333bf" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-333fm" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-333oh" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-clock" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-minx" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-pyram" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-skewb" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-sq1" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-444bf" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-555bf" />
            </TableHead>
            <TableHead>
              <span className="cubing-icon event-333mbf" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </main>
  );
}
