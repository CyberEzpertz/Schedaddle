"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  activeCourse: string | null;
}

let initialMount = false;

export function DataTable<TData, TValue>({
  columns,
  data,
  activeCourse,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    if (!activeCourse) return;

    const stored = localStorage.getItem("selectedRows_" + activeCourse);
    const parsed = stored !== null ? JSON.parse(stored) : null;

    if (parsed) {
      setRowSelection(parsed);
    }

    setColumnFilters([
      {
        id: "courseCode",
        value: activeCourse,
      },
    ]);

    return () => {
      initialMount = false;
    };
  }, [activeCourse]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      rowSelection,
    },
    initialState: {
      columnVisibility: {
        courseCode: false,
      },
    },
  });

  useEffect(() => {
    console.log(`Init: ${initialMount}`);

    if (!activeCourse || !initialMount) {
      initialMount = true;
      return;
    }

    localStorage.setItem(
      "selectedRows_" + activeCourse,
      JSON.stringify(rowSelection)
    );

    const selectedData = localStorage.getItem("selected_data");
    const parsedData = selectedData !== null ? JSON.parse(selectedData) : {};
    const selectedRowsData = Object.keys(rowSelection).map(
      (rowId) => data[Number.parseInt(rowId)]
    );

    parsedData[activeCourse] = selectedRowsData;

    localStorage.setItem("selected_data", JSON.stringify(parsedData));
  }, [activeCourse, rowSelection, data]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
