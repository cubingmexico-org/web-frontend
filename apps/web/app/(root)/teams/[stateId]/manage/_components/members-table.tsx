"use client";

import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import type { getMembers, getMembersGenderCounts } from "../../_lib/queries";
import { getColumns } from "./members-table-columns";
import { Member } from "../../_types";
import { DataTableRowAction } from "@/types/data-table";
import { DeleteMembersDialog } from "./delete-member-dialog";

interface MembersTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getMembers>>,
      Awaited<ReturnType<typeof getMembersGenderCounts>>,
    ]
  >;
}

export function MembersTable({ promises }: MembersTableProps) {
  const [{ data, pageCount }, genderCounts] = React.use(promises);

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Member> | null>(null);

  const columns = React.useMemo(
    () =>
      getColumns({
        genderCounts,
        setRowAction,
      }),
    [genderCounts],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "name", desc: false }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        gender: false,
      },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    enableRowSelection: false,
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
      <DeleteMembersDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        tasks={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
